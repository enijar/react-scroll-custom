import React, {Component, createRef} from "react";
import "./index.scss";
import {clamp, getBoundingBox, map} from "./utils";

export default class Scroll extends Component {
  #raf = null;
  #scroller = createRef();
  #track = createRef();
  #handle = createRef();

  state = {
    pointerDown: false,
    trackHeight: 0,
    trackTop: 0,
    scrollerHeight: 0,
    handleHeight: 10,
    scrollYHeight: 0,
    progressY: 0,
  };

  #scroll = y => {
    const pointerPosition = clamp(y - this.state.trackTop, 0, this.state.trackHeight);
    const progress = map(pointerPosition, 0, this.state.trackHeight, 0, 1);
    this.#scroller.current.scrollTo(0, clamp(this.state.scrollYHeight * progress, 0, this.state.scrollYHeight));
  };

  #handleScroll = event => {
    this.setState({progressY: this.state.progressY = 1 / this.state.scrollYHeight * event.target.scrollTop});
  };

  #handlePointerDown = event => {
    this.setState({pointerDown: true});
    this.#scroll(event.pageY);
  };

  #handlePointerMove = event => {
    if (this.state.pointerDown) {
      this.#scroll(event.pageY);
    }
  };

  #handlePointerUp = () => {
    this.setState({pointerDown: false});
  };

  #getTrackStyle = () => {
    // console.log(this.state.scrollYHeight, this.state.scrollerHeight);

    return {
      display: this.state.scrollYHeight <= this.state.scrollerHeight ? 'none' : undefined,
    };
  };

  #getHandleStyle = () => {
    const {progressY, trackHeight, handleHeight} = this.state;
    return {
      marginTop: `${map(progressY, 0, 1, 0, trackHeight - handleHeight)}px`,
      height: `${this.state.handleHeight}px`,
    };
  };

  #updateState = () => {
    this.#raf = requestAnimationFrame(this.#updateState);
    const trackBox = getBoundingBox(this.#track.current);
    const scrollerHeight = this.#scroller.current.clientHeight;
    console.log(this.#scroller.current.scrollHeight, this.#scroller.current.clientHeight);
    const scrollYHeight = Math.max(this.#scroller.current.scrollHeight - scrollerHeight, 0);
    this.setState({
      trackHeight: trackBox.height,
      trackTop: trackBox.top,
      handleHeight: clamp(scrollerHeight * (1 / scrollYHeight * scrollerHeight), 0, scrollerHeight),
      scrollerHeight,
      scrollYHeight,
    });
  };

  componentDidMount() {
    this.#raf = requestAnimationFrame(this.#updateState);
    this.#scroller.current.addEventListener('scroll', this.#handleScroll);
    this.#track.current.addEventListener('pointerdown', this.#handlePointerDown);
    window.addEventListener('pointermove', this.#handlePointerMove);
    window.addEventListener('pointerup', this.#handlePointerUp);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.#raf);
    this.#scroller.current.removeEventListener('scroll', this.#handleScroll);
    this.#track.current.removeEventListener('pointerdown', this.#handlePointerDown);
    window.removeEventListener('pointermove', this.#handlePointerMove);
    window.removeEventListener('pointerup', this.#handlePointerUp);
  }

  render() {
    return (
      <div className="Scroll">
        <div className="Scroll__scroller" ref={this.#scroller}>
          <div className="Scroll__content">
            {this.props.children}
          </div>
        </div>
        <div className="Scroll__track" style={this.#getTrackStyle()} ref={this.#track}>
          <div className="Scroll__handle" style={this.#getHandleStyle()} ref={this.#handle}/>
        </div>
      </div>
    );
  }
}
