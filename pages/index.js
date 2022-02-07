import * as React from "react";
import * as Constants from "~/common/constants";
import * as SVGLogo from "~/common/logo";
import * as SVG from "~/common/svg";
import * as System from "~/components/system";
import * as Validations from "~/common/validations";
import * as Strings from "~/common/strings";

import WebsitePrototypeWrapper from "~/components/core/WebsitePrototypeWrapper";
import WebsiteHeader from "~/components/core/WebsiteHeader";
import WebsiteFooter from "~/components/core/WebsiteFooter";

import { css } from "@emotion/react";
import { useForm } from "~/common/hooks";
import { motion, AnimateSharedLayout } from "framer-motion";
import { AuthField } from "~/components/core/Auth/components";

const INTEGRATION = [
  {
    title: "Chrome",
    body: "Connect to your browser history and bookmarks.",
    logo:
      "https://slate.textile.io/ipfs/bafkreiamdcnqxcga7dj4fur7nqd57pbey7s6znnj4o2zpbkmsydp6rspdy",
  },
  {
    title: "Twitter",
    body: "Search your twitter bookmarks.",
    logo:
      "https://slate.textile.io/ipfs/bafkreihtujowfnffw5jxvdo7gqazo4oy3q3q4u4z2jflx5ygmpaj7pgtnu",
  },
  {
    title: "MetaMask",
    body: "Keep all of your NFTs in one place.",
    logo:
      "https://slate.textile.io/ipfs/bafkreiecbn5pjuebdelsehul6sqmxs5kk74mijmo6ybts3hfg5tr2p4rti",
  },
  {
    title: "And more later",
    last: true,
  },
];

const FAQ = [
  {
    title: "What makes Slate different from other bookmarking / storage tools?",
    text:
      "Slate is designed to automatically save and organize things for you to help you remember things and explore things you care about in an entirely new way.",
  },
  {
    title: "Is my data safe / private?",
    text:
      "Short answer — yes. We use all the industry standards to protect your data and ensure that you have complete control over who is able to see anything in your account. We do not sell and never will sell your data to any third-party.",
  },
  {
    title: "How much does Slate cost?",
    text:
      "Slate is free for everyone to use. We plan on adding premium tools and functionality to enhance your internet experience some time in 2022. ",
  },
];

const BANNER = [
  {
    link:
      "https://slate.host/tara/neon-genesis-evangelion?cid=bafybeib2zzeknjmih25wivzogzupd7atrdbaxpvmsxfgutrqymlyfc2dvi",
    name: "@tara",
    img:
      "https://slate.textile.io/ipfs/bafybeib2zzeknjmih25wivzogzupd7atrdbaxpvmsxfgutrqymlyfc2dvi",
  },
  {
    link:
      "https://slate.host/biodivlibrary/the-mushroom-book?cid=bafybeigph7tfup3wb3truahl7sycaywx3unwa365jk4assrjjlzv6d7x3a",
    name: "@biodivlibrary",
    img:
      "https://slate.textile.io/ipfs/bafybeigph7tfup3wb3truahl7sycaywx3unwa365jk4assrjjlzv6d7x3a",
  },
  {
    link:
      "https://slate.host/jin/cryptovoxels-history?cid=bafybeiafrj3erh3rfqux4zqc7u2px3veqdppbtizq26p443utxunrkgonu",
    name: "@jin",
    img:
      "https://slate.textile.io/ipfs/bafybeiafrj3erh3rfqux4zqc7u2px3veqdppbtizq26p443utxunrkgonu",
  },
  {
    link:
      "https://slate.host/ng/numero?cid=bafybeibhhfgc4amvymoblaxcoe6glyyvaxhylzisl4ib2itcbhn3mrviou",
    name: "@ng",
    img:
      "https://slate.textile.io/ipfs/bafybeibhhfgc4amvymoblaxcoe6glyyvaxhylzisl4ib2itcbhn3mrviou",
  },
  {
    link:
      "https://slate.host/thesimpsons/clips?cid=bafybeigce5klzr3vgzmlathvepuzhzhmwjc6bbvmsmcvu5eyisy6mnkx34",
    name: "@thesimpsons",
    img:
      "https://slate.textile.io/ipfs/bafybeigce5klzr3vgzmlathvepuzhzhmwjc6bbvmsmcvu5eyisy6mnkx34",
  },

  {
    link:
      "https://slate.host/bitgraves/september?cid=bafybeiclkru6hwzw2ghvsyrbnaf67taxxhq2hbpcia2oqj5ufdggwhcbti",
    name: "@bitgraves",
    img:
      "https://slate.textile.io/ipfs/bafybeiclkru6hwzw2ghvsyrbnaf67taxxhq2hbpcia2oqj5ufdggwhcbti",
  },
  {
    link:
      "https://slate.host/nypl/japan-kimbei-kusakabe?cid=bafkreidqz6imwffq5hpkacmxnrffagzxx5usybpitt42yuzthe6uf4idlm",
    name: "@nypl",
    img:
      "https://slate.textile.io/ipfs/bafkreidqz6imwffq5hpkacmxnrffagzxx5usybpitt42yuzthe6uf4idlm",
  },
  {
    link:
      "https://slate.host/atlas/cartography?cid=bafybeid2n55qb4thosrxlszhzi3nwiorswv7xi2d5ykbudp3ph5hc54baa",
    name: "@atlas",
    img:
      "https://slate.textile.io/ipfs/bafybeid2n55qb4thosrxlszhzi3nwiorswv7xi2d5ykbudp3ph5hc54baa",
  },
  {
    link:
      "https://slate.host/museosabiertos/palais-de-glace-fotografia?cid=bafybeigrznzuqymmfligf6mhc7adh6r7iw5gotbrzstcqeyyybaklfguki",
    name: "@museosabiertos",
    img:
      "https://slate.textile.io/ipfs/bafybeigrznzuqymmfligf6mhc7adh6r7iw5gotbrzstcqeyyybaklfguki",
  },
  {
    link:
      "https://slate.host/gndclouds/animation?cid=bafybeigh44l3uzsgv4hslpruxrr5s43olpj5llptmsafkemxbwlu4fbdc4",
    name: "@gndclouds",
    img:
      "https://slate.textile.io/ipfs/bafybeigh44l3uzsgv4hslpruxrr5s43olpj5llptmsafkemxbwlu4fbdc4",
  },

  {
    link:
      "https://slate.host/cindy/sw-sans?cid=bafkreihazsjq7hlho6ab6k7tise6ufv2ccat5gv5f3fz7yy4cluz3e356e",
    name: "@cindy",
    img:
      "https://slate.textile.io/ipfs/bafkreihazsjq7hlho6ab6k7tise6ufv2ccat5gv5f3fz7yy4cluz3e356e",
  },
  {
    link:
      "https://slate.host/haris/archive?cid=bafkreigcdnhxnh4fp7g2xy2gp43umhjrqyzz2a2t3ovnmcabepwusx5ldi",
    name: "@haris",
    img:
      "https://slate.textile.io/ipfs/bafkreigcdnhxnh4fp7g2xy2gp43umhjrqyzz2a2t3ovnmcabepwusx5ldi",
  },
  {
    link:
      "https://slate.host/guji/%E5%8C%97%E4%BA%AC%E7%9A%87%E5%9F%8E%E5%BB%BA%E7%AD%91%E8%A3%85%E9%A5%B0?cid=bafybeiceh32ka3l6nlxniziefaxqs44ib4i47pohdftjzvlbsoem3qk6ly",
    name: "@guji",
    img:
      "https://slate.textile.io/ipfs/bafybeiceh32ka3l6nlxniziefaxqs44ib4i47pohdftjzvlbsoem3qk6ly",
  },
  {
    link:
      "https://slate.host/martina/reaction-gifs?cid=bafybeif344hukksxizwk2dhmp6xjybnbw6x62r23m6wju2btxpsk4yluki",
    name: "@martina",
    img:
      "https://slate.textile.io/ipfs/bafybeif344hukksxizwk2dhmp6xjybnbw6x62r23m6wju2btxpsk4yluki",
  },
];

const OBJECTPREVIEWS = [
  {
    title: "Nils Frahm - Old Friends New Friends",
    link: (
      <img
        style={{ height: 12, marginRight: 4 }}
        src="https://slate.textile.io/ipfs/bafkreig6vbqgunqmja4vt6rrpojbtf24dnkgt2lxcvpl4x7gtnn7rqbp4a"
      />
    ),
    type: "Soundcloud",
    preview:
      "https://slate.textile.io/ipfs/bafkreic5z2j6kz4qn4zgcv2wakvgok7bgn2tdsrirrcbmcngbty3m4n7fi",
    URL:
      "https://slate.host/slate/objects?cid=bafybeicdrezbs4xtdgwmhef52fwu5dkw2bv3m6sbfbd7wikleszezufeci",
  },
  {
    title: "zancan - Lushtemples",
    link: (
      <img
        style={{ height: 12, marginRight: 4 }}
        src="https://slate.textile.io/ipfs/bafkreiayzflrhnmknrbe6w6fyp6anepb2sdik23g7zid4gadmtpjizpnuu"
      />
    ),
    type: "hicetnunc.art",
    preview:
      "https://slate.textile.io/ipfs/bafkreia7ir22cbomueh6amuypurqyggqnxsbdirapljxgeoju7m656cvve",
    URL:
      "https://slate.host/slate/objects?cid=bafybeig5mukv6kzfcwphudok6wksjxkglfb2akvt3yzhnqcooj2juwegiu",
  },
  {
    title: "OP-Z Synthesizer",
    link: <SVG.Link height={12} style={{ marginRight: 4 }} />,
    type: "JPEG",
    preview:
      "https://slate.textile.io/ipfs/bafkreiagkyoslopcxar5pt4vum4ngkbqnqzspa4kbeyltlxpsh7a6xb3mm",
    URL:
      "https://slate.host/slate/objects?cid=bafybeiaaqrbqdgytuk362qe7oezw5vvkue5yhmp5oxdxw76clvnvp7w2yu",
  },
  {
    title: "Hermann Hesse - Demian",
    link: <SVG.Link height={12} style={{ marginRight: 4 }} />,
    type: "PDF",
    preview:
      "https://slate.textile.io/ipfs/bafkreierp2ddmptriabymjse2mu772hftl7zrl63akbthl42cl6yvsiddu",
    URL:
      "https://slate.host/slate/objects?cid=bafybeietqtoktbmkxlsfrhhcdodbjd7bixkjvrxxxjsy6s7tdqwuicxhw4",
  },
  {
    title: "ASMR prime numbers",
    link: (
      <img
        style={{ height: 12, marginRight: 4 }}
        src="https://slate.textile.io/ipfs/bafkreieb7zmiss2rlnlhhkwbgxlc7szmzsq3yars7ujjflhwq6it2low5m"
      />
    ),
    type: "Youtube",
    preview:
      "https://slate.textile.io/ipfs/bafkreiaars3ztdupanomdsy2o3ok6xr6gcjmwc2situnquggiz5x2xokgy",
    URL:
      "https://slate.host/slate/objects?cid=bafybeigaet3w3yvpchwup33tr3oyhpu3ckjnrbqq7a7kxoqwp3drzxsmvm",
  },
  {
    title: "r/dostoevsky - Fyodor Dostoevsky",
    link: (
      <img
        style={{ height: 12, marginRight: 4 }}
        src="https://slate.textile.io/ipfs/bafkreigmnfr6bnermvxegkrfg2lfy7pzifopbtnttql4jn2j33vzopw4e4"
      />
    ),
    type: "Reddit",
    preview:
      "https://slate.textile.io/ipfs/bafybeiafyuacznehtudad5hxzhbri4snjucrsnna2nzjifocebazy6xkt4",
    URL:
      "https://slate.host/slate/objects?cid=bafybeidmxr5vebmqthxsxdy7w5laxb45y6rdg27vjhf5pauu2iyjng7b6e",
  },
];

const STYLES_ROOT = css`
  width: 100%;
  height: 100%;
  overflow: hidden;
  min-height: 100vh;
  background-color: ${Constants.semantic.bgLight};
  color: ${Constants.semantic.textGrayDark};
`;

const STYLES_CONTAINER = css`
  max-width: 1080px;
  margin: 0 auto;
  padding: 80px 24px;

  @media (max-width: ${Constants.sizes.mobile}px) {
    max-width: 480px;
    padding: 96px 16px;
  }
`;

const STYLES_CONTAINER_FLEX = css`
  ${STYLES_CONTAINER};
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${Constants.sizes.mobile}px) {
    display: block;
  }
`;

const STYLES_HERO_TEXT = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
  max-width: 640px;
  margin: 0 auto;
`;

const STYLES_TEXT = css`
  max-width: calc(50% - 24px);
  margin: 48px 0;

  @media (max-width: ${Constants.sizes.mobile}px) {
    max-width: 100%;
  }
`;

const STYLES_HEADING = css`
  font-family: ${Constants.font.semiBold};
  flex-shrink: 0;
  color: ${Constants.semantic.textBlack};
  flex-shrink: 0;
  min-width: 50%;
  max-width: 100%;
`;

const STYLES_HEADING1 = css`
  ${STYLES_HEADING};
  font-size: 84px;
  line-height: 88px;
  letter-spacing: -0.05em;
  text-align: center;

  @media (max-width: ${Constants.sizes.tablet}px) {
    font-size: 64px;
    line-height: 68px;
    letter-spacing: -0.04em;
  }

  @media (max-width: ${Constants.sizes.mobile}px) {
    font-size: 48px;
    line-height: 52px;
    letter-spacing: -0.04em;
  }
`;

const STYLES_HEADING2 = css`
  ${STYLES_HEADING};
  font-size: 56px;
  line-height: 64px;
  letter-spacing: -0.035em;
  margin-bottom: 30px;

  @media (max-width: ${Constants.sizes.tablet}px) {
    font-size: 48px;
    line-height: 56px;
  }

  @media (max-width: ${Constants.sizes.mobile}px) {
    font-size: 40px;
    line-height: 48px;
    margin-bottom: 32px;
  }
`;

const STYLES_HEADING3 = css`
  ${STYLES_HEADING};
  font-family: ${Constants.font.medium};
  font-size: 20px;
  line-height: 28px;
  letter-spacing: -0.02em;
  margin-bottom: 16px;

  @media (max-width: ${Constants.sizes.mobile}px) {
    font-size: 18px;
    line-height: 28px;
  }
`;

const STYLES_BODY1 = css`
  font-family: ${Constants.font.medium};
  font-size: 24px;
  line-height: 36px;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
  text-align: center;
  width: 100%;

  @media (max-width: ${Constants.sizes.tablet}px) {
    font-size: 20px;
    line-height: 28px;
    margin-bottom: 20px;
  }
`;

const STYLES_BODY2 = css`
  font-family: ${Constants.font.text};
  font-size: 18px;
  line-height: 28px;
  letter-spacing: -0.01em;
  max-width: 100%;
`;

const STYLES_BODY3 = css`
  font-family: ${Constants.font.medium};
  font-size: 12px;
  line-height: 20px;
  letter-spacing: -0.006em;
`;

const STYLES_IMG = css`
  max-width: 100%;
  overflow: hidden;
  box-shadow: 0px 10.8725px 57.9866px rgba(174, 176, 178, 0.3);
  max-width: calc(50% - 24px);
`;

const STYLES_IMG_HERO = css`
  ${STYLES_IMG};
  max-width: 150%;
  border: 12px solid ${Constants.semantic.textBlack};
  border-radius: 40px;

  @media (max-width: ${Constants.sizes.tablet}px) {
    border: 8px solid ${Constants.semantic.textBlack};
    border-radius: 24px;
  }
`;

const STYLES_BUTTON = css`
  cursor: poitner;
  display: inline-flex;
  flex-grow: 0;
  justify-content: center;
  align-items: center;
  box-shadow: ${Constants.shadow.lightMedium};
  text-decoration: none;
  font-family: ${Constants.font.medium};
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.006px;
  cursor: pointer;
`;

const STYLES_BUTTON_PRIMARY = css`
  ${STYLES_BUTTON};
  color: ${Constants.semantic.textWhite};
  background-color: ${Constants.system.blue};
`;

const STYLES_BUTTON_PRIMARY_BIG = css`
  ${STYLES_BUTTON_PRIMARY};
  padding: 14px 32px;
  border-radius: 20px;
  font-size: 16px;
  line-height: 24px;
`;

const STYLES_BUTTON_PRIMARY_BIG_HERO = css`
  ${STYLES_BUTTON_PRIMARY_BIG};
  margin: 0 auto 48px auto;
`;

const STYLES_BUTTON_PRIMARY_SMALL = css`
  ${STYLES_BUTTON_PRIMARY};
  padding: 1px 12px 3px;
  border-radius: 8px;
`;

const STYLES_BUTTON_SECONDARY = css`
  ${STYLES_BUTTON};
  color: ${Constants.semantic.textBlack};
  background-color: ${Constants.semantic.bgGrayLight};
`;

const STYLES_BUTTON_SECONDARY_SMALL = css`
  ${STYLES_BUTTON_SECONDARY};
  padding: 1px 12px 3px;
  border-radius: 8px;
`;

const STYLES_CARD_GROUP = css`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  @media (max-width: ${Constants.sizes.mobile}px) {
    display: block;
  }
`;

const STYLES_CARD = css`
  background-color: ${Constants.semantic.bgWhite};
  border-radius: 24px;
  padding: 21px 20px 20px;
  width: calc(33.3% - 16px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;

  @media (max-width: ${Constants.sizes.mobile}px) {
    width: 100%;
    margin-bottom: 16px;
  }
`;

const STYLES_CURSOR_BLINK = css`
  display: inline-block;
  background-color: ${Constants.semantic.textGrayLight};
  width: 37px;
  height: 61px;
  margin-left: 6px;
  overflow: hidden;
  animation: blink-animation 1s steps(5, start) infinite;
  -webkit-animation: blink-animation 1s steps(5, start) infinite;
  @keyframes blink-animation {
    to {
      visibility: hidden;
    }
  }
  @-webkit-keyframes blink-animation {
    to {
      visibility: hidden;
    }
  }

  @media (max-width: ${Constants.sizes.tablet}px) {
    width: 28.5px;
    height: 47px;
    margin-left: 4px;
  }

  @media (max-width: ${Constants.sizes.mobile}px) {
    width: 21px;
    height: 35px;
    margin-left: 2px;
  }
`;

const STYLES_CURSOR_BLINK_SMALL = css`
  ${STYLES_CURSOR_BLINK}
  width: 25px;
  height: 41px;
  margin-left: 3px;

  @media (max-width: ${Constants.sizes.tablet}px) {
    width: 21px;
    height: 35px;
    margin-left: 2px;
  }

  @media (max-width: ${Constants.sizes.mobile}px) {
    width: 17.5px;
    height: 29px;
    margin-left: 2px;
  }
`;

const STYLES_ROTATING_BANNER = css`
  background-color: ${Constants.semantic.bgDark};
  width: 100%;
  overflow: hidden;
  padding: 48px 0 36px 0;
`;

const STYLES_BANNER_ANIMATION = css`
  display: flex;
  position: relative;
  align-items: center;
  animation: moving 240s linear infinite;
  -webkit-animation: moving 240s linear infinite;
  @keyframes moving {
    0% {
      transform: translateX(0px);
    }
    100% {
      transform: translateX(-90%);
    }
  }
  @-webkit-keyframes moving {
    0% {
      transform: translateX(0px);
    }
    100% {
      transform: translateX(-90%);
    }
  }
`;

const STYLES_BANNER_GROUP = css`
  display: flex;
  align-items: center;
`;

const STYLES_BANNER_IMG = css`
  max-width: 200px;
  max-height: 200px;
  box-shadow: ${Constants.shadow.lightMedium};
`;

const STYLES_BANNER_ITEM = css`
  text-decoration: none;
  color: ${Constants.semantic.textGrayLight};
  margin-left: 88px;
  cursor: pointer;
`;

const STYLES_AUTH_MODAL = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 36px 32px;
  background: linear-gradient(180deg, #ffffff 0%, #f7f8f9 100%);
  border-radius: 20px;
  max-width: 480px;
  margin: 0 auto;
  width: 100%;
`;

const STYLES_DIVIDER = css`
  height: 1px;
  width: 64px;
  background-color: ${Constants.semantic.textGray};
  margin: 32px auto;
`;

const STYLES_ROADMAP = css`
  display: flex;
  flex-direction: column;
  max-width: calc(50% - 24px);

  @media (max-width: ${Constants.sizes.mobile}px) {
    max-width: 100%;
  }
`;

const STYLES_TOOL_ICON = css`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 12px;
  background-color: ${Constants.semantic.bgGrayLight};
  border-radius: 12px;
  height: 56px;
  width: 56px;
  margin-right: 20px;
  margin-bottom: 16px;
`;

const STYLES_TOOL = css`
  display: flex;
  width: 100%;
`;

const STYLES_CONNECT_LINE = css`
  background-color: ${Constants.semantic.bgGrayLight4};
  height: 48px;
  width: 2px;
  margin: 0 0 16px 27px;
`;

const STYLES_CONNECT_BAR = css`
  width: 16px;
  height: 6px;
  background-color: ${Constants.semantic.textBlack};
  display: inline-flex;
  margin: 0 -4px;

  @media (max-width: ${Constants.sizes.mobile}px) {
    height: 5px;
  }
`;

const STYLES_WRAPPER = css`
  position: relative;
  background-color: ${Constants.semantic.bgLight};
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  width: 100%;
  border: 1px solid ${Constants.semantic.borderGrayLight};
  color: ${Constants.semantic.textBlack};
  text-decoration: none;

  :hover {
    box-shadow: ${Constants.shadow.card};
    transform: translateY(-4px);
    transition: transform 0.2s ease-in-out;
  }
`;

const STYLES_INNER_WRAPPER = css`
  display: block;
  padding-top: 100%;
`;

const STYLES_DESCRIPTION = css`
  position: absolute;
  bottom: 0;
  border-radius: 0px 0px 16px 16px;
  box-sizing: border-box;
  width: 100%;
  background-color: ${Constants.semantic.bgWhite};
  padding: 9px 16px 10px;
  font-family: ${Constants.font.medium};
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.006px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const STYLES_PREVIEW = css`
  position: absolute;
  top: 0;
  object-fit: cover;
  width: 100%;
  height: calc(100% - 58px);
  background-color: ${Constants.semantic.bgWhite};
  border-bottom: 1px solid ${Constants.semantic.borderGrayLight};
`;

const STYLES_TYPE = css`
  display: flex;
  padding-top: 3px;
  color: ${Constants.semantic.textGray};
  font-family: ${Constants.font.text};
  font-size: 12px;
  line-height: 16px;
  align-items: center;
`;

const STYLES_OBJECT_GROUP = css`
  display: grid;
  width: calc(50% - 24px);
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: ${Constants.sizes.mobile}px) {
    width: 100%;
  }
`;

const STYLES_FEATURE_CARD = css`
  width: calc(50% - 12px);
  max-height: 400px;
  background: ${Constants.semantic.bgGrayLight};
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 16px;

  @media (max-width: ${Constants.sizes.mobile}px) {
    width: 100%;
    max-height: 372px;
  }
`;

const STYLES_ICON_BUTTON = css`
  width: 32px;
  height: 32px;
  display: inline-flex;
  margin-right: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${Constants.semantic.bgWhite};
  border: 1px solid ${Constants.semantic.borderGrayLight4};
  box-shadow: 0px 4px 16px ${Constants.shadow.lightSmall};
  border-radius: 8px;
`;

const STYLES_FEATURE_DESCRIPTION = css`
  padding: 21px 20px 19px;
`;

const STYLES_FEATURE_IMG = css`
  display: block;
  margin: 0 20px;
  width: calc(100% - 40px);
  border: ${Constants.semantic.borderGrayLight4};
  border-radius: 16px;
  box-shadow: ${Constants.shadow.darkMedium};
`;

const ObjectPreview = (props) => {
  return (
    <a css={STYLES_WRAPPER} href={props.URL}>
      <div css={STYLES_INNER_WRAPPER}>
        <img css={STYLES_PREVIEW} src={props.preview} />
        <div css={STYLES_DESCRIPTION}>
          {props.title}
          <div css={STYLES_TYPE}>
            {props.link}
            {props.type}
          </div>
        </div>
      </div>
    </a>
  );
};

const Integration = (props) => {
  return (
    <div style={{ width: "100%" }}>
      <div css={STYLES_TOOL}>
        {props.logo ? (
          <img css={STYLES_TOOL_ICON} src={props.logo} />
        ) : (
          <div css={STYLES_TOOL_ICON} />
        )}
        <div>
          <div css={STYLES_HEADING3} style={{ marginBottom: 4 }}>
            {props.title}{" "}
          </div>
          <div css={STYLES_BODY2} style={{ color: Constants.semantic.textGrayDark }}>
            {props.body}
          </div>
        </div>
      </div>
      {!props.last && <div css={STYLES_CONNECT_LINE} />}
    </div>
  );
};

const Card = (props) => {
  return (
    <div css={STYLES_CARD} style={props.style}>
      <div styles={{ height: "100%" }}>
        {!!props.logo ? props.logo : <div css={STYLES_HEADING3}>{props.title}</div>}
        <div css={STYLES_BODY2}>{props.text}</div>
      </div>
      {props.action && (
        <a
          css={STYLES_BUTTON_SECONDARY_SMALL}
          style={{ marginTop: 24 }}
          href={props.link}
          target="_blank"
        >
          {props.action}
        </a>
      )}
    </div>
  );
};

const Banner = (props) => {
  return (
    <a css={STYLES_BANNER_ITEM} href={props.link}>
      <img css={STYLES_BANNER_IMG} src={props.img} />
      <div css={STYLES_BODY3}>{props.name}</div>
    </a>
  );
};

export default function IndexPage() {
  const title = `Slate`;
  const description = "Your personal search engine";
  const url = "https://slate.host/";
  const image =
    "https://slate.textile.io/ipfs/bafkreifww37ypduoi5pvj2cuikz7iycp7l5h7czke6lcboukkaqkoab3t4";
  const signInURL = "/_/auth";
  const discordURL = "https://discord.gg/NRsUjpCypr";
  const {
    getFieldProps: getSignupFielProps,
    getFormProps: getSigninFormProps,
    isSubmitting: isCheckingSignupEmail,
  } = useForm({
    validateOnBlur: false,
    initialValues: { email: "" },
    validate: ({ email }, errors) => {
      if (Strings.isEmpty(email)) errors.email = "Please provide an email";
      else if (!Validations.email(email)) errors.email = "Invalid email address";
      return errors;
    },
    onSubmit: async ({ email }) => {
      window.open(`/_/auth?tab=signup&email=${encodeURIComponent(email)}`, "_self");
    },
  });

  return (
    <WebsitePrototypeWrapper title={title} description={description} url={url} image={image}>
      <WebsiteHeader />
      <div css={STYLES_ROOT}>
        <div css={STYLES_CONTAINER}>
          <div css={STYLES_HERO_TEXT}>
            <div css={STYLES_HEADING1}>Your personal </div>
            <div
              css={STYLES_HEADING1}
              style={{ color: Constants.semantic.textGray, marginBottom: 24 }}
            >
              search
              <span css={STYLES_CURSOR_BLINK} />
              <span style={{ color: Constants.semantic.textBlack }}> engine</span>
            </div>
            <div css={STYLES_BODY1}>
              Slate is a search tool designed to help you remember and keep track of things you care
              about on the web.
            </div>
            <a css={STYLES_BUTTON_PRIMARY_BIG_HERO} href={signInURL}>
              Get started
            </a>
          </div>
          <img
            css={STYLES_IMG_HERO}
            src="https://slate.textile.io/ipfs/bafybeiczylx6qu7kwdpy6ydejki6c2cwrniyvzye2gkjxgknm2czkkf7hy"
          />
        </div>

        <div css={STYLES_CONTAINER_FLEX}>
          <div css={STYLES_OBJECT_GROUP} style={{ marginRight: 48 }}>
            {OBJECTPREVIEWS.map((each) => (
              <ObjectPreview
                title={each.title}
                preview={each.preview}
                type={each.type}
                link={each.link}
                URL={each.URL}
              />
            ))}
          </div>
          <div css={STYLES_TEXT}>
            <div css={STYLES_HEADING2}>A single place to save all your things</div>
            <div css={STYLES_BODY2}>
              Save anything from the web directly to Slate without worrying about how or where to
              save it.
            </div>
          </div>
        </div>

        <div css={STYLES_CONTAINER}>
          <div css={STYLES_TEXT}>
            <div css={STYLES_HEADING2}>
              Get back to things instantly with global{" "}
              <span style={{ color: Constants.semantic.textGray }}>search</span>
              <div css={STYLES_CURSOR_BLINK_SMALL} />
            </div>
            <div css={STYLES_BODY2}>
              Find things fast with integrated search available to you anywhere in the browser.
            </div>
          </div>
          <div css={STYLES_CONTAINER_FLEX} style={{ padding: 0 }}>
            <div css={STYLES_FEATURE_CARD}>
              <div css={STYLES_FEATURE_DESCRIPTION}>
                <div css={STYLES_HEADING3}>
                  Use the Slate browser extension to search and save from anywhere.
                </div>
                <div css={STYLES_ICON_BUTTON}>⌥</div>
                <div css={STYLES_ICON_BUTTON}>S</div>
              </div>
              <img
                css={STYLES_FEATURE_IMG}
                style={{ width: "90%", margin: "20% 24px", border: "6px solid #000000" }}
                src="https://slate.textile.io/ipfs/bafybeihsrxgjk5ax4wzbnfnq2kyg4djylrvpsbzrhitvnmcjixupbk5qjm"
              />
              <img
                css={STYLES_FEATURE_IMG}
                style={{ width: "70%", margin: "-95% auto 48px auto" }}
                src="https://slate.textile.io/ipfs/bafkreievp6angjfzf5awdnqeog4rr73ukz24xnlpdmajfdp2lfstzlkr24"
              />
            </div>
            <div css={STYLES_FEATURE_CARD}>
              <div css={STYLES_FEATURE_DESCRIPTION}>
                <div css={STYLES_HEADING3}>
                  Use tags and keywords to search across all of your links and files.
                </div>
                <div style={{ height: 32 }}></div>
              </div>
              <img
                css={STYLES_FEATURE_IMG}
                style={{ margin: "0 0 0 20px", width: "120%" }}
                src="https://slate.textile.io/ipfs/bafkreidllwo5j6uyx75alz5amuhrrs5uylw3slgowofy2rx7yn4rttakiq"
              />
            </div>
          </div>
        </div>

        <div css={STYLES_CONTAINER_FLEX}>
          <div css={STYLES_ROADMAP} style={{ marginRight: 48 }}>
            <div
              css={STYLES_BUTTON_PRIMARY_SMALL}
              style={{
                backgroundColor: Constants.system.orange,
                marginBottom: 16,
                alignSelf: "flex-start",
                cursor: "default",
              }}
            >
              Coming soon
            </div>
            {INTEGRATION.map((each) => (
              <Integration title={each.title} body={each.body} logo={each.logo} last={each.last} />
            ))}
          </div>
          <div css={STYLES_TEXT}>
            <div css={STYLES_HEADING2}>
              Con
              <div css={STYLES_CONNECT_BAR} />
              nect with <br />
              your favorite tools
            </div>
            <div css={STYLES_BODY2}>
              Starting with your browser, Slate integrates seamlessly with all the places you save
              and bookmark things to make them searchable to you in one place.
            </div>
          </div>
        </div>

        <div css={STYLES_CONTAINER}>
          <div css={STYLES_TEXT}>
            <div css={STYLES_HEADING2}>Organize and share however you like</div>
            <div css={STYLES_BODY2}>
              Add tags to create relationships and connections to help you remember things. Create
              channels to share things publicly on the web.
            </div>
          </div>

          <div css={STYLES_CONTAINER_FLEX} style={{ padding: 0 }}>
            <div css={STYLES_FEATURE_CARD}>
              <div css={STYLES_FEATURE_DESCRIPTION}>
                <div css={STYLES_HEADING3}>
                  Use tags to help you organize your things on the fly.
                </div>
                <div css={STYLES_ICON_BUTTON}>#</div>
              </div>
              <img
                css={STYLES_FEATURE_IMG}
                style={{ width: "90%", margin: "20% 24px", border: "6px solid #000000" }}
                src="https://slate.textile.io/ipfs/bafybeia7eclwk2zk6jv2agfwjj4fs57yhxz7vgwchaa6w34wf7xwohq7ky"
              />
              <img
                css={STYLES_FEATURE_IMG}
                style={{ width: "70%", margin: "-100% auto 48px auto" }}
                src="https://slate.textile.io/ipfs/bafkreiaopgorx45iriyjzl2fcdygt3fma2s47m6z7vi323pbpdmhx3m64u"
              />
            </div>
            <div css={STYLES_FEATURE_CARD}>
              <div css={STYLES_FEATURE_DESCRIPTION}>
                <div css={STYLES_HEADING3}>
                  Create channels to share collections, topics or archives of things publicly on the
                  web.
                </div>
                <div style={{ height: 32 }}></div>
              </div>
              <img
                css={STYLES_FEATURE_IMG}
                style={{ margin: "0 0 0 20px", width: "120%" }}
                src="https://slate.textile.io/ipfs/bafybeiffx4fuhmne56yul3z24w6sh5ciumgy6dymdf6m3izdr6dknakhzy"
              />
            </div>
          </div>
        </div>

        <div css={STYLES_CONTAINER}>
          <div css={STYLES_TEXT}>
            <div css={STYLES_HEADING2}>FAQs</div>
          </div>
          <div css={STYLES_CARD_GROUP}>
            {FAQ.map((each) => (
              <Card title={each.title} text={each.text} />
            ))}
          </div>
        </div>

        <div css={STYLES_CONTAINER} style={{ paddingBottom: 24 }}>
          <div css={STYLES_TEXT}>
            <div css={STYLES_HEADING2}>Come hang out</div>
            <div css={STYLES_BODY2}>Join our discord channel for questions and discussions.</div>
            <a
              css={STYLES_BUTTON_PRIMARY_BIG}
              style={{ backgroundColor: "#7289d9", marginTop: 24 }}
              href={discordURL}
              target="_blank"
            >
              <SVGLogo.Discord height="14px" style={{ marginRight: "16px" }} />
              Join Discord channel
            </a>
          </div>
        </div>
        <div css={STYLES_ROTATING_BANNER}>
          <div css={STYLES_BANNER_GROUP}>
            <div css={STYLES_BANNER_ANIMATION}>
              {BANNER.map((each) => (
                <Banner link={each.link} name={each.name} img={each.img} />
              ))}
              {BANNER.map((each) => (
                <Banner link={each.link} name={each.name} img={each.img} />
              ))}
              {BANNER.map((each) => (
                <Banner link={each.link} name={each.name} img={each.img} />
              ))}
              {BANNER.map((each) => (
                <Banner link={each.link} name={each.name} img={each.img} />
              ))}
            </div>
          </div>
        </div>

        <div css={STYLES_CONTAINER}>
          <div css={STYLES_TEXT} style={{ margin: "40px auto", textAlign: "center" }}>
            <div css={STYLES_HEADING2}>Get started for free</div>
          </div>
          <div css={STYLES_AUTH_MODAL}>
            <System.ButtonPrimaryFull
              type="link"
              href="/_/auth"
              style={{ backgroundColor: "#1DA1F2" }}
            >
              <SVGLogo.Twitter height="14px" style={{ marginRight: "16px" }} />
              Sign up with Twitter
            </System.ButtonPrimaryFull>
            <div css={STYLES_DIVIDER} />
            <form {...getSigninFormProps()} style={{ width: "100%" }}>
              <AuthField
                {...getSignupFielProps("email")}
                label="Sign up with email"
                placeholder="Email"
                type="text"
                full
                style={{
                  backgroundColor: "rgba(242, 242, 247,0.7)",
                  border: "1px solid #D1D4D6",
                }}
                containerStyle={{ marginTop: "4px" }}
              />
              <AnimateSharedLayout>
                <motion.div layoutId="landing-signup-submit-button">
                  <System.ButtonPrimaryFull
                    loading={isCheckingSignupEmail}
                    type="submit"
                    style={{ marginTop: "12px" }}
                  >
                    Create account
                  </System.ButtonPrimaryFull>
                </motion.div>
              </AnimateSharedLayout>
            </form>
          </div>
        </div>
      </div>
      <AnimateSharedLayout>
        <motion.div layoutId="landing-footer">
          <WebsiteFooter />
        </motion.div>
      </AnimateSharedLayout>
    </WebsitePrototypeWrapper>
  );
}
