import React from 'react';
import Header from './Header';
import Axios from 'axios';
import { uploadFile, fileChangeHandler } from "./actions";

class Floor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { source: "", planLoad: false }
    Axios.get( `/uploads/${this.props.user}/floor_plan.jpg`, 
      { responseType: 'arraybuffer' }
    ).then(response => {
      const base64 = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte), ''
        ),
      );
      this.setState({ source: "data:;base64," + base64 });
      this.setState({ planLoad: true });
    });
  }
  render() {
    const currentUser = this.props.user;
    const floor = this.props.floor;
    //console.log("floor " + floor);
    //console.log("planLoad " + this.state.planLoad);
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
          {this.state.planLoad && floor && <img src={this.state.source} alt="Floor Plan"></img>}
           {/* {`./uploads/${currentUser}/floor_plan.jpg`} */}
        </section>
      </div>
    );
  }
}

export default Floor;