import React, {PureComponent} from 'react';
import {render} from 'react-dom';
import DeckGL, {COORDINATE_SYSTEM, SimpleMeshLayer, OrbitView, LinearInterpolator} from 'deck.gl';

import {PLYLoader} from '@loaders.gl/ply';
import {loadFile} from '@loaders.gl/core';

const DATA_URL =
  'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/point-cloud-ply/lucy100k.ply';

const INITIAL_VIEW_STATE = {
  target: [0, 0, 0],
  rotationX: 0,
  rotationOrbit: 0,
  orbitAxis: 'Y',
  fov: 30,
  zoom: 1
};

const transitionInterpolator = new LinearInterpolator(['rotationOrbit']);

class Example extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      viewState: INITIAL_VIEW_STATE,
      data: [[0, 0, 0]],
      mesh: loadFile(DATA_URL, PLYLoader)
    };

    this._onLoad = this._onLoad.bind(this);
    this._onViewStateChange = this._onViewStateChange.bind(this);
    this._rotateCamera = this._rotateCamera.bind(this);
  }

  _onViewStateChange({viewState}) {
    this.setState({viewState});
  }

  _onLoad() {
    this._rotateCamera();
  }

  _rotateCamera() {
    const {viewState} = this.state;
    this.setState({
      viewState: {
        ...viewState,
        rotationOrbit: viewState.rotationOrbit + 30,
        transitionDuration: 350,
        transitionInterpolator,
        onTransitionEnd: this._rotateCamera
      }
    });
  }

  _renderLayers() {
    const {data, mesh} = this.state;

    return [
      new SimpleMeshLayer({
        id: 'lucy',
        data,
        mesh,
        coordinateSystem: COORDINATE_SYSTEM.IDENTITY,
        getPosition: d => d
      })
    ];
  }

  render() {
    const {viewState} = this.state;

    return (
      <DeckGL
        views={new OrbitView()}
        viewState={viewState}
        controller={true}
        onLoad={this._onLoad}
        onViewStateChange={this._onViewStateChange}
        layers={this._renderLayers()}
      />
    );
  }
}

export function renderToDOM(container) {
  render(<Example />, container);
}
