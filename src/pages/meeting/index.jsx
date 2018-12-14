import React from "react";
import * as Cookies from "js-cookie";

import "./meeting.css";
import AgoraVideoCall from "../../components/AgoraVideoCall";
import { AGORA_APP_ID } from "../../agora.config";
import { getTimer, setTimer } from "../../helpers/api";

const TIMER_ENABLED = true

class Meeting extends React.Component {
  state = {
    timeRemaining: undefined,
    timer: undefined,
    showMetrics: false
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  constructor(props) {
    super(props);
    (this.videoProfile = Cookies.get("videoProfile").split(",")[0] || "480p_4"),
      (this.channel = Cookies.get("channel") || "test"),
      (this.transcode = Cookies.get("transcode") || "interop"),
      (this.attendeeMode = Cookies.get("attendeeMode") || "video"),
      (this.baseMode = Cookies.get("baseMode") || "avc");
    this.appId = AGORA_APP_ID;
    if (!this.appId) {
      return alert("Get App ID first!");
    }
    this.uid = undefined;
    this.getLastTime = this.getLastTime.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

  }

  getLastTime(channelName) {
    getTimer(channelName)
      .then(resp => {
        const data = resp.data;
        const timeRemaining = this.sectostr(data.seconds_remaining);
        this.setState({ timeRemaining });
        console.log(this.state.timeRemaining);
      })
      .catch(err => {
        const data = err.response.data;
        if (data.errorMessage) {
          if (data.errorMessage.indexOf("never been set") !== -1) {
            setTimer(channelName).then(setResp => {
              const setData = setResp.data;
              console.log("set timer", JSON.stringify(setData));
            });
          } else {
            // Timer ran out
            window.location.href = "/";
            alert("Meeting Timed Out!");
          }
        }
      });
  }

  sectostr(time) {
    // convert seconds to MM:SS string.
    return ~~(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + (time % 60);
  }

  setTimerSchedule() {
    const channelName = this.channel;
    const timer = setInterval(() => this.getLastTime(channelName), 1000);

    this.setState({ timer });
  }

  componentDidMount() {
    if (TIMER_ENABLED) {
      this.getLastTime(this.channel);
      this.setTimerSchedule();
    }
  }

  componentWillUnmount() {
    const { timer } = this.state;
    if (timer) {
      clearInterval(this.state.timer);
    }
  }

  render() {
    const { showMetrics, timeRemaining } = this.state;
    return (
      <div className="wrapper meeting">
        <div className="ag-header">
          <div className="ag-header-lead">
            <img
              className="header-logo"
              src={require("../../assets/images/five.png")}
              alt=""
            />
            <span>Boardroom</span>
            {timeRemaining && (
              <span>
                &nbsp;-&nbsp;Time Remaining:&nbsp;
                <span className="time-remaining">{timeRemaining}</span>
              </span>
            )}
          </div>
          <div className="ag-header-msg">
            Room:&nbsp;<span id="room-name">{this.channel}</span>,&nbsp;
            <label>
              Show Metrics: &nbsp;
            <input
              name="showMetrics"
              type="checkbox"
              checked={showMetrics}
              onChange={this.handleInputChange} />
            </label>
          </div>
        </div>
        <div className="ag-main">
          <div className="ag-container">
            <AgoraVideoCall
              videoProfile={this.videoProfile}
              channel={this.channel}
              transcode={this.transcode}
              attendeeMode={this.attendeeMode}
              baseMode={this.baseMode}
              appId={this.appId}
              uid={this.uid}
              showMetrics={showMetrics}
            />
          </div>
        </div>
        <div className="ag-footer">
          <a className="ag-href" href="https://www.agora.io">
            <span>Powered By Agora</span>
          </a>
          <span>Boardroom</span>
        </div>
      </div>
    );
  }
}

export default Meeting;
