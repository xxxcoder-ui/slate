import * as React from "react";
import * as System from "~/components/system";
import * as Constants from "~/common/constants";
import * as Actions from "~/common/actions";
import * as Strings from "~/common/strings";

import { css } from "@emotion/react";
import { LoaderSpinner } from "~/components/system/components/Loaders";
import { SecondaryTabGroup } from "~/components/core/TabGroup";

import WebsitePrototypeWrapper from "~/components/core/WebsitePrototypeWrapper";
import ScenePage from "~/components/core/ScenePage";
import ScenePageHeader from "~/components/core/ScenePageHeader";
import SceneSettings from "~/scenes/SceneSettings";
import SceneDeals from "~/scenes/SceneDeals";
import SceneWallet from "~/scenes/SceneWallet";

const STYLES_SPINNER_CONTAINER = css`
  width: 100%;
  height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

let mounted = false;

export default class SceneArchive extends React.Component {
  state = {
    deals: [],
    dealsLoaded: false,
    networkViewer: null,
    allowAutomaticDataStorage: this.props.viewer.allowAutomaticDataStorage,
    allowEncryptedDataStorage: this.props.viewer.allowEncryptedDataStorage,
  };

  async componentDidMount() {
    if (mounted) {
      return null;
    }

    mounted = true;
    let networkViewer;
    try {
      const response = await fetch("/api/network");
      const json = await response.json();
      networkViewer = json.data;
    } catch (e) {}

    this.setState({
      networkViewer,
    });

    let deals = [];
    try {
      const response = await fetch("/api/network-deals");
      const json = await response.json();
      deals = json.data.deals;
    } catch (e) {}

    if (!deals || !deals.length) {
      this.setState({ dealsLoaded: true });
    }

    this.setState({ deals, dealsLoaded: true });
  }

  _handleCheckboxChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  _handleSaveFilecoin = async (e) => {
    this.setState({ changingFilecoin: true });

    await Actions.updateViewer({
      allowAutomaticDataStorage: this.state.allowAutomaticDataStorage,
      allowEncryptedDataStorage: this.state.allowEncryptedDataStorage,
    });

    this.setState({ changingFilecoin: false });
  };

  componentWillUnmount() {
    mounted = false;
  }

  render() {
    let tab = this.props.page.params?.tab || "archive";
    return (
      <WebsitePrototypeWrapper
        title={`${this.props.page.pageTitle} • Slate`}
        url={`${Constants.hostname}${this.props.page.pathname}`}
      >
        <ScenePage>
          <ScenePageHeader title="Filecoin">
            {/* Use this section to archive all of your data on to Filecoin through a storage deal. You
          must have at last 100MB stored to make an archive storage deal.  */}
          </ScenePageHeader>

          <SecondaryTabGroup
            tabs={[
              { title: "Archive Settings", value: { tab: "archive" } },
              { title: "Wallet", value: { tab: "wallet" } },
            ]}
            value={tab}
            onAction={this.props.onAction}
          />

          {this.state.networkViewer ? (
            <React.Fragment>
              {tab === "archive" ? (
                <React.Fragment>
                  <ScenePageHeader>
                    Use this section to archive all of your data on to Filecoin through a storage
                    deal. You must have at last 100MB stored to make an archive storage deal.
                  </ScenePageHeader>

                  <System.P1 style={{ marginTop: 24 }}>
                    Archive all of your data onto the Filecoin Network with a storage deal using
                    your default settings.
                  </System.P1>
                  <br />
                  <System.ButtonPrimary
                    onClick={() =>
                      this.props.onAction({
                        type: "SIDEBAR",
                        value: "SIDEBAR_FILECOIN_ARCHIVE",
                      })
                    }
                  >
                    Archive your data
                  </System.ButtonPrimary>

                  <System.DescriptionGroup
                    style={{ marginTop: 64 }}
                    label="Archive automation settings"
                    description="Configure the automation settings for your archive storage deals."
                  />

                  <System.CheckBox
                    style={{ marginTop: 24 }}
                    name="allowAutomaticDataStorage"
                    value={this.state.allowAutomaticDataStorage}
                    onChange={this._handleCheckboxChange}
                  >
                    Allow Slate to make archive storage deals on your behalf to the Filecoin
                    Network. You will get a receipt in the Filecoin section.
                  </System.CheckBox>

                  <System.CheckBox
                    style={{ marginTop: 24 }}
                    name="allowEncryptedDataStorage"
                    value={this.state.allowEncryptedDataStorage}
                    onChange={this._handleCheckboxChange}
                  >
                    Force encryption on archive storage deals (only you can see retrieved data from
                    the Filecoin network).
                  </System.CheckBox>

                  <div style={{ marginTop: 24 }}>
                    <System.ButtonPrimary
                      onClick={this._handleSaveFilecoin}
                      loading={this.state.changingFilecoin}
                    >
                      Save archiving settings
                    </System.ButtonPrimary>
                  </div>
                  <br />
                  <br />
                  <SceneSettings {...this.props} networkViewer={this.state.networkViewer} />
                </React.Fragment>
              ) : null}

              {tab === "wallet" ? (
                <React.Fragment>
                  <SceneWallet {...this.props} networkViewer={this.state.networkViewer} />
                  <br />
                  <br />
                  {this.state.dealsLoaded ? (
                    <SceneDeals deals={this.state.deals} dealsLoaded={this.state.dealsLoaded} />
                  ) : (
                    <div css={STYLES_SPINNER_CONTAINER}>
                      <LoaderSpinner style={{ height: 32, width: 32 }} />
                    </div>
                  )}
                </React.Fragment>
              ) : null}
            </React.Fragment>
          ) : (
            <div css={STYLES_SPINNER_CONTAINER}>
              <LoaderSpinner style={{ height: 32, width: 32 }} />
            </div>
          )}
        </ScenePage>
      </WebsitePrototypeWrapper>
    );
  }
}
