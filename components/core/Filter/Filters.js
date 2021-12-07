import * as React from "react";
import * as SVG from "~/common/svg";
import * as Styles from "~/common/styles";
import * as Typography from "~/components/system/components/Typography";
import * as Utilities from "~/common/utilities";

import ProfilePhoto from "~/components/core/ProfilePhoto";

import { css } from "@emotion/react";
import { useFilterContext } from "~/components/core/Filter/Provider";
import { Link } from "~/components/core/Link";
import { ButtonPrimary, ButtonSecondary } from "~/components/system/components/Buttons";

/* -------------------------------------------------------------------------------------------------
 *  Shared components between filters
 * -----------------------------------------------------------------------------------------------*/

const STYLES_FILTER_BUTTON_HIGHLIGHTED = (theme) => css`
  background-color: ${theme.semantic.bgGrayLight};
`;

const STYLES_FILTER_BUTTON = (theme) => css`
  display: flex;
  align-items: center;
  width: 100%;
  ${Styles.BUTTON_RESET};
  padding: 5px 8px 3px;
  border-radius: 8px;
  color: ${theme.semantic.textBlack};
  &:hover {
    background-color: ${theme.semantic.bgGrayLight};
    color: ${theme.semantic.textBlack};
  }

  &:disabled {
    color: ${theme.semantic.textGray};
    pointer-events: none;
    cursor: not-allowed;
  }
`;

const STYLES_FILTERS_GROUP = css`
  & > * + * {
    margin-top: 4px !important;
  }
  li {
    list-style: none;
  }
`;

const FilterButton = ({ children, Icon, isSelected, ...props }) => (
  <li>
    <Link {...props}>
      <span as="span" css={[STYLES_FILTER_BUTTON, isSelected && STYLES_FILTER_BUTTON_HIGHLIGHTED]}>
        <Icon height={16} width={16} style={{ flexShrink: 0 }} />
        <Typography.P2 as="span" nbrOflines={1} style={{ marginLeft: 6 }}>
          {children}
        </Typography.P2>
      </span>
    </Link>
  </li>
);

const FilterSection = ({ title, children, ...props }) => (
  <div {...props}>
    {title && (
      <Typography.H6 style={{ paddingLeft: 8, marginBottom: 4 }} color="textGray">
        {title}
      </Typography.H6>
    )}
    <ul css={STYLES_FILTERS_GROUP}>{children}</ul>
  </div>
);

/* -------------------------------------------------------------------------------------------------
 *  InitialFilters
 * -----------------------------------------------------------------------------------------------*/

function Library({ page, onAction }) {
  const [, { hidePopup }] = useFilterContext();

  const isSelected = page.id === "NAV_DATA";

  return (
    <>
      <FilterSection>
        <FilterButton
          href="/_/data"
          isSelected={isSelected}
          onAction={onAction}
          Icon={SVG.Clock}
          onClick={hidePopup}
        >
          My Library
        </FilterButton>
      </FilterSection>
    </>
  );
}

function Tags({ viewer, data, onAction, ...props }) {
  const [, { hidePopup }] = useFilterContext();

  return (
    <FilterSection title="Tags" {...props}>
      {viewer.slates.map((slate) => (
        <FilterButton
          key={slate.id}
          href={`/$/slate/${slate.id}`}
          isSelected={slate.id === data?.id}
          onAction={onAction}
          Icon={slate.isPublic ? SVG.Hash : SVG.SecurityLock}
          onClick={hidePopup}
        >
          {slate.slatename}
        </FilterButton>
      ))}
    </FilterSection>
  );
}

function Profile({ viewer, data, page, onAction, ...props }) {
  if (page.id === "NAV_SLATE") {
    data = data.owner;
  }

  const [, { hidePopup }] = useFilterContext();
  const isAuthenticated = !!viewer;
  const isOwner = viewer?.id === data.id;

  const [isFollowing, setIsFollowing] = React.useState(() =>
    isOwner
      ? false
      : !!viewer?.following.some((entry) => {
          return entry.id === data.id;
        })
  );

  React.useEffect(() => {
    let updatedIsFollowing = isOwner
      ? false
      : !!viewer?.following.some((entry) => {
          return entry.id === data.id;
        });
    setIsFollowing(updatedIsFollowing);
  }, [viewer?.following, data?.id]);

  const handleFollow = async () => {
    if (!isAuthenticated) {
      Events.dispatchCustomEvent({ name: "slate-global-open-cta", detail: {} });
      return;
    }
    await Actions.createSubscription({
      userId: data.id,
    });
  };

  const username = Utilities.getUserDisplayName(data);
  let { twitterUsername, body } = data;

  return (
    <FilterSection {...props}>
      <div css={Styles.VERTICAL_CONTAINER_CENTERED} style={{ gap: "12px" }}>
        <ProfilePhoto user={data} style={{ borderRadius: "20px" }} size={80} />
        <div css={Styles.VERTICAL_CONTAINER_CENTERED} style={{ gap: "4px" }}>
          <Typography.H4 color="textGrayDark" style={{ marginTop: 10 }}>
            {username}
          </Typography.H4>
          {twitterUsername && (
            <div css={Styles.HORIZONTAL_CONTAINER_CENTERED} style={{ gap: "4px" }}>
              <SVG.Twitter style={{ width: "16px" }} />
              <Typography.P2 color="textGrayDark">{twitterUsername}</Typography.P2>
            </div>
          )}
          {body && (
            <Typography.P2 color="textGrayDark" nbrOflines={4} style={{ textAlign: "center" }}>
              {body}
            </Typography.P2>
          )}
        </div>
        {isFollowing ? (
          <ButtonSecondary
            full
            onClick={() => {
              setIsFollowing(false);
              handleFollow();
            }}
          >
            Unfollow
          </ButtonSecondary>
        ) : (
          <ButtonPrimary
            full
            onClick={() => {
              setIsFollowing(true);
              handleFollow();
            }}
          >
            Follow
          </ButtonPrimary>
        )}
      </div>
    </FilterSection>
  );
}

function ProfileTags({ viewer, data, page, onAction, ...props }) {
  const [, { hidePopup }] = useFilterContext();

  let user = data;
  if (page.id === "NAV_SLATE") {
    user = data.owner;
  }

  return (
    <FilterSection {...props}>
      {user?.slates?.map((slate) => (
        <FilterButton
          key={slate.id}
          href={`/$/slate/${slate.id}`}
          isSelected={slate.id === data?.id}
          onAction={onAction}
          Icon={slate.isPublic ? SVG.Hash : SVG.SecurityLock}
          onClick={hidePopup}
        >
          {slate.slatename}
        </FilterButton>
      ))}
    </FilterSection>
  );
}

export { Library, Tags, Profile, ProfileTags };
