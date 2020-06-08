import React, {Component} from 'react';
import {connect} from 'react-redux';
import Inhale from './Inhale';
import InhaleFirstLaunch from './InhaleFirstLaunch';

class BreathingGame extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {breathingGameFirstRun} = this.props;
    return (
      <>
        {breathingGameFirstRun ? (
          <InhaleFirstLaunch {...this.props} />
        ) : (
          <Inhale {...this.props} />
        )}
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {firstLaunch} = state;

  const {breathingGameFirstRun} = firstLaunch;
  return {
    breathingGameFirstRun,
  };
};

export default connect(mapStateToProps)(BreathingGame);
