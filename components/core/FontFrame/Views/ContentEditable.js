import * as React from "react";

function normalizeHtml(str) {
  return str && str.replace(/&nbsp;|\u202F|\u00A0/g, " ");
}

export default class ContentEditable extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { html } = nextProps;
    const el = this.myRef.current;

    if (normalizeHtml(el.innerHTML) !== normalizeHtml(html)) return true;
    return false;
  }

  componentDidUpdate() {
    if (!this.myRef) return;
    const { html } = this.props;
    const el = this.myRef.current;
    /** NOTE(Amine): because we often prevent rerendering,
     *  React doesn't update the Dom, so we do it manually
     */
    if (normalizeHtml(el.innerHTML) !== normalizeHtml(html)) {
      el.innerHTML = this.props.html;
    }
  }

  handleChange = () => {
    const el = this.myRef.current;
    if (!el) return;
    this.props.onChange(el.innerHTML);
  };

  render() {
    const { onChange, html, ...props } = this.props;
    return (
      <div
        {...props}
        contentEditable={true}
        onInput={this.handleChange}
        ref={this.myRef}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
}
