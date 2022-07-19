import React from "react";

type PageAdminProps = {};
type PageAdminState = {};

export default class PageAdmin extends React.Component<
  PageAdminProps,
  PageAdminState
> {
  constructor(props: {}) {
    super(props);
    this.state = {
        
    };
  }

  render() {
    return (
      <div>
        <h1>PageAdmin</h1>
      </div>
    );
  }
}
