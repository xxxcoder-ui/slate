import * as React from "react";

import Application from "~/components/core/Application";

export const getServerSideProps = async ({ query }) => {
  return {
    props: {
      viewer: query.viewer,
      isMobile: query.isMobile,
      isMac: query.isMac,
      resources: query.resources,
    },
  };
};

export default class ApplicationPage extends React.Component {
  render() {
    return (
      <Application
        viewer={this.props.viewer}
        isMobile={this.props.isMobile}
        isMac={this.props.isMac}
        resources={this.props.resources}
      />
    );
  }
}
