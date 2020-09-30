import React from 'react';
import Header from './Header';
import { uploadFile, fileChangeHandler, fetchUploadFile } from "./actions";
import BaseReactComponent from "./BaseReactComponent";

class Floor extends BaseReactComponent {
  filterState({ floor, source, planLoad }) {
    return { floor, source, planLoad };
  }
  constructor(props) {
    super(props);
    fetchUploadFile();
  }
  render() {
    const { floor, source, planLoad } = this.state;
    const currentUser = this.props.user;
    return (
      <div>
        <Header user={currentUser} />
        <section className="content">
          <header>
            <h1>Floor Plan</h1>
          </header>
          <form method="post" encType="multipart/form-data" onSubmit={e => uploadFile(e)}>
            <input className="fileInpt" type="file" name="file" onChange={fileChangeHandler} />
            <input className="fileInpt" type="submit" value="Upload Floor Plan Image" />
          </form>
          {planLoad && floor && <img src={source} alt="Floor Plan"></img>}
        </section>
      </div>
    );
  }
}

export default Floor;