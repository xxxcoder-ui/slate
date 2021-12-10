import * as Environment from "~/node_common/environment";
import * as Data from "~/node_common/data";
import * as Utilities from "~/node_common/utilities";
import * as ViewerManager from "~/node_common/managers/viewer";
import * as Websocket from "~/node_common/nodejs-websocket";
import * as Logging from "~/common/logging";
import * as Validations from "~/common/validations";
import * as Window from "~/common/window";
import * as Strings from "~/common/strings";
import * as NavigationData from "~/common/navigation-data";

import limit from "express-rate-limit";
import express from "express";
import next from "next";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import { FilecoinNumber } from "@glif/filecoin-number";

const app = next({
  dev: !Environment.IS_PRODUCTION,
  dir: __dirname,
  quiet: false,
});

const createLimiter = limit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,
  message: {
    decorator: "SIGN_UP_RATE_LIMITED",
    error: true,
    message: "You have made too many requests.",
  },
});

const loginLimiter = limit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,
  message: {
    decorator: "SIGN_IN_RATE_LIMITED",
    error: true,
    message: "You have made too many requests.",
  },
});

const handler = app.getRequestHandler();

app.prepare().then(async () => {
  const server = express();

  server.use(cors());
  server.use(morgan(":method :url :status :res[content-length] - :response-time ms"));

  if (Environment.IS_PRODUCTION) {
    server.use(compression());
  }

  server.use("/public", express.static("public"));
  server.get("/service-worker.js", express.static(path.join(__dirname, ".next")));
  server.get("/system", async (r, s) => s.redirect("/_/system"));
  server.get("/experiences", async (r, s) => s.redirect("/_/system"));
  server.get("/_/experiences", async (r, s) => s.redirect("/_/system"));
  server.get("/system/:c", async (r, s) => s.redirect(`/_/system/${r.params.c}`));
  server.get("/experiences/:m", async (r, s) => s.redirect(`/_/experiences/${r.params.m}`));

  server.all("/api/users/create", createLimiter, async (r, s) => {
    return handler(r, s, r.url);
  });

  server.all("/api/sign-in", loginLimiter, async (r, s) => {
    return handler(r, s, r.url);
  });

  server.all("/api/:a", async (r, s) => {
    return handler(r, s, r.url);
  });

  server.all("/api/:a/:b", async (r, s) => {
    return handler(r, s, r.url);
  });

  server.get("/", async (req, res) => {
    return app.render(req, res, "/", {});
  });

  server.get("/_", async (req, res) => {
    return res.redirect("/_/data");
    // let isMobile = Window.isMobileBrowser(req.headers["user-agent"]);
    // let isMac = Window.isMac(req.headers["user-agent"]);

    // const isBucketsAvailable = await Utilities.checkTextile();

    // if (!isBucketsAvailable && Environment.IS_PRODUCTION) {
    //   return res.redirect("/maintenance");
    // }

    // const id = Utilities.getIdFromCookie(req);

    // let viewer = null;
    // if (id) {
    //   viewer = await Data.getUserById({
    //     id,
    //   });
    // }

    // if (viewer) {
    //   return res.redirect("/_/data");
    // } else {
    //   return res.redirect("/_/activity");
    // }

    // let page = NavigationData.getById(null, viewer);

    // return app.render(req, res, "/_", {
    //   viewer,
    //   isMobile,
    //   isMac,
    //   page,
    //   data: null,
    // });
  });

  server.get("/_/view/:id", async (req, res) => {
    let isMobile = Window.isMobileBrowser(req.headers["user-agent"]);
    let isMac = Window.isMac(req.headers["user-agent"]);

    const fileId = req.params.id;

    const file = await Data.getFileById({ id: fileId });

    const id = Utilities.getIdFromCookie(req);

    let viewer = null;
    if (id) {
      viewer = await ViewerManager.getById({
        id,
      });
    }

    if (id && id === file.ownerId) {
      file.owner = viewer;
    } else {
      file.owner = await Data.getUserById({ id: file.ownerId, sanitize: true });
    }

    return app.render(req, res, "/_/file", {
      viewer,
      isMobile,
      isMac,
      data: file,
    });
  });

  server.get("/_/:scene", async (req, res) => {
    let isMobile = Window.isMobileBrowser(req.headers["user-agent"]);
    let isMac = Window.isMac(req.headers["user-agent"]);

    const id = Utilities.getIdFromCookie(req);

    let viewer = null;
    if (id) {
      viewer = await ViewerManager.getById({
        id,
      });
    }

    let { page, redirected } = NavigationData.getByHref(req.path, viewer);
    if (redirected) {
      return res.redirect(page.pathname);
    }
    // if (!redirected) {
    page.params = req.query;
    // }

    if (!page) {
      return handler(req, res, req.url, {
        isMobile,
      });
    }

    return app.render(req, res, "/_", {
      isMobile,
      isMac,
      viewer,
      page,
      data: null,
    });
  });

  server.all("/_/:a", async (r, s) => handler(r, s, r.url));
  server.all("/_/:a/:b", async (r, s) => handler(r, s, r.url));

  server.get("/[$]/slate/:id", async (req, res) => {
    const slate = await Data.getSlateById({
      id: req.params.id,
    });

    if (!slate || slate.error) {
      return res.redirect("/_/404");
    }

    const creator = await Data.getUserById({
      id: slate.ownerId,
    });

    if (!creator || creator.error) {
      return res.redirect("/_/404");
    }

    let search = Strings.getQueryStringFromParams(req.query);

    return res.redirect(`/${creator.username}/${slate.slatename}${search}`);
  });

  server.get("/[$]/user/:id", async (req, res) => {
    const creator = await Data.getUserById({
      id: req.params.id,
    });

    if (!creator || creator.error) {
      return res.redirect("/_/404");
    }

    let search = Strings.getQueryStringFromParams(req.query);

    return res.redirect(`/${creator.username}${search}`);
  });

  server.get("/[$]/:id", async (req, res) => {
    const slate = await Data.getSlateById({
      id: req.params.id,
    });

    if (!slate || slate.error) {
      return res.redirect("/_/404");
    }

    const creator = await Data.getUserById({
      id: slate.ownerId,
    });

    if (!creator || creator.error) {
      return res.redirect("/_/404");
    }

    let search = Strings.getQueryStringFromParams(req.query);

    return res.redirect(`/${creator.username}/${slate.slatename}${search}`);
  });

  server.get("/:username", async (req, res) => {
    const username = req.params.username.toLowerCase();
    let isMobile = Window.isMobileBrowser(req.headers["user-agent"]);
    let isMac = Window.isMac(req.headers["user-agent"]);

    // TODO(jim): Temporary workaround
    if (!Validations.userRoute(username)) {
      return handler(req, res, req.url, {
        isMobile,
      });
    }

    const id = Utilities.getIdFromCookie(req);

    let user = await Data.getUserByUsername({
      username,
    });

    if (!user) {
      return res.redirect("/_/404");
    }

    if (user.error) {
      return res.redirect("/_/404");
    }

    if (user.id === id) {
      return res.redirect("/_/data");
    }

    const slates = await Data.getSlatesByUserId({
      ownerId: user.id,
      publicOnly: true,
    });

    if (slates && !slates.error) {
      if (slates.length) {
        return res.redirect(`/${username}/${slates[0].slatename}`);
      }

      user.slates = slates;
    }

    let viewer = null;
    if (id) {
      viewer = await ViewerManager.getById({
        id,
      });
    }

    let { page, redirected } = NavigationData.getByHref(req.path, viewer);
    if (!redirected) {
      page.params = req.query;
    }

    return app.render(req, res, "/_", {
      viewer,
      isMobile,
      isMac,
      data: user,
      page,
    });
  });

  // server.get("/:username/cid::cid", async (req, res) => {
  //   const username = req.params.username.toLowerCase();
  //   const cid = req.params.cid.toLowerCase();

  //   let isMobile = Window.isMobileBrowser(req.headers["user-agent"]);
  //   let isMac = Window.isMac(req.headers["user-agent"]);

  //   // TODO(jim): Temporary workaround
  //   if (!Validations.userRoute(username)) {
  //     return handler(req, res, req.url);
  //   }

  //   const id = Utilities.getIdFromCookie(req);

  //   let user = await Data.getUserByUsername({
  //     username,
  //     includeFiles: true,
  //     sanitize: true,
  //     publicOnly: true,
  //   });

  //   if (!user) {
  //     return res.redirect("/_/404");
  //   }

  //   if (user.error) {
  //     return res.redirect("/_/404");
  //   }

  //   const slates = await Data.getSlatesByUserId({
  //     ownerId: user.id,
  //     includeFiles: true,
  //     publicOnly: true,
  //   });

  //   user.slates = slates;

  //   let viewer = null;
  //   if (id) {
  //     viewer = await ViewerManager.getById({
  //       id,
  //     });
  //   }

  //   let page = NavigationData.getById("NAV_PROFILE", viewer);
  //   page = { ...page, cid };

  //   return app.render(req, res, "/_", {
  //     viewer,
  //     isMobile,
  //     isMac,
  //     page,
  //     data: user,
  //   });
  // });

  server.get("/:username/:slatename", async (req, res) => {
    const username = req.params.username.toLowerCase();
    const slatename = req.params.slatename.toLowerCase();

    let isMobile = Window.isMobileBrowser(req.headers["user-agent"]);
    let isMac = Window.isMac(req.headers["user-agent"]);

    // TODO(jim): Temporary workaround
    if (!Validations.userRoute(username)) {
      return handler(req, res, req.url, {
        isMobile,
      });
    }

    const id = Utilities.getIdFromCookie(req);

    let viewer = null;
    if (id) {
      viewer = await ViewerManager.getById({
        id,
      });
    }

    let { page, redirected } = NavigationData.getByHref(req.path, viewer);
    if (!redirected) {
      page.params = req.query;
    }

    const slate = await Data.getSlateByName({
      slatename,
      username,
      includeFiles: true,
    });

    if (!slate || slate.error || (!slate.isPublic && slate.ownerId !== id)) {
      return res.redirect("/_/404");
    }

    const owner = await Data.getUserById({
      id: slate.ownerId,
      sanitize: true,
    });

    if (!owner) {
      return res.redirect("/_/404");
    }

    if (owner.error) {
      return res.redirect("/_/404");
    }

    let slates = await Data.getSlatesByUserId({
      ownerId: owner.id,
      publicOnly: true,
    });

    if (slates && !slates.error) {
      owner.slates = slates;
    }

    slate.owner = owner;

    return app.render(req, res, "/_", {
      viewer,
      isMobile,
      isMac,
      data: slate,
      page,
    });
  });

  // server.get("/:username/:slatename/cid::cid", async (req, res) => {
  //   const username = req.params.username.toLowerCase();
  //   const slatename = req.params.slatename.toLowerCase();
  //   const cid = req.params.cid.toLowerCase();

  //   let isMobile = Window.isMobileBrowser(req.headers["user-agent"]);
  //   let isMac = Window.isMac(req.headers["user-agent"]);

  //   // TODO(jim): Temporary workaround
  //   if (!Validations.userRoute(username)) {
  //     return handler(req, res, req.url);
  //   }

  //   const id = Utilities.getIdFromCookie(req);

  //   const slate = await Data.getSlateByName({
  //     slatename,
  //     username,
  //     includeFiles: true,
  //   });

  //   if (!slate) {
  //     return res.redirect("/_/404");
  //   }

  //   if (slate.error || !slate.isPublic && slate.ownerId !== id) {
  //     return res.redirect("/_/404");
  //   }

  //   const user = await Data.getUserById({
  //     id: slate.ownerId,
  //     sanitize: true,
  //   });

  //   if (!user) {
  //     return res.redirect("/_/404");
  //   }

  //   if (user.error) {
  //     return res.redirect("/_/404");
  //   }

  //   let viewer = null;
  //   if (id) {
  //     viewer = await ViewerManager.getById({
  //       id,
  //     });
  //   }

  //   slate.user = user;

  //   let page = NavigationData.getById("NAV_SLATE", viewer);
  //   page = { ...page, cid };

  //   return app.render(req, res, "/_", {
  //     viewer,
  //     isMobile,
  //     isMac,
  //     data: slate,
  //     page,
  //   });
  // });

  server.all("*", async (r, s) => handler(r, s, r.url));

  server.listen(Environment.PORT, async (e) => {
    if (e) throw e;
    Websocket.create();

    Logging.log(`started on http://localhost:${Environment.PORT}`);

    const filecoinNumber = new FilecoinNumber("10000", "attoFil");

    Logging.log(`Testing Values: ${filecoinNumber.toPicoFil()} PICO FIL`);
    Logging.log(`Testing Values: ${filecoinNumber.toAttoFil()} ATTO FIL`);
    Logging.log(`Testing Values: ${filecoinNumber.toFil()} FIL`);
  });
});
