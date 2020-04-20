import React, {Component} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {connect} from 'react-redux';
import Content from '../content/Content';
import RBSheet from '../../components/rbsheet';
import {ScreenWidth, ScreenHeight} from '../../helpers/constants/common';
import {colors} from '../../helpers/theme';
import _ from 'lodash';
import ShuffleIcon from '../../../assets/icons/shuffle.png';

class Bookmarks extends Component {
  constructor(props) {
    super(props);
    this.groupBookmarksBySet = {};
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({type: 'FETCH_BOOKMARKS'});
  }

  handleShuffle = () => {
    const {shuffle, dispatch} = this.props;
    shuffle
      ? dispatch({type: 'BOOKMARK_SHUFFLE_OFF'})
      : dispatch({type: 'BOOKMARK_SHUFFLE_ON'});
  };

  handleClose = () => this.props.dispatch({type: 'SET_MINIMIZE_TRUE'});

  rbsheetClose = () => {
    this.props.dispatch({type: 'SET_MINIMIZE_FALSE'});
    this.RBSheet.close();
  };

  handleStart = () => {
    this.props.dispatch({type: 'SET_CONTENT_TYPE', contentType: 'bookmarks'});
    this.RBSheet.open();
  };

  renderItem = ({item, index, drag, isActive}) => {
    const bookmarkItems = this.groupBookmarksBySet[item];

    return (
      <TouchableOpacity
        style={[
          styles.item,
          isActive && {backgroundColor: 'rgb(216, 216, 216)'},
        ]}
        onLongPress={drag}>
        <Text style={styles.itemText}>{bookmarkItems[0].category}</Text>
        <Text />
        <Text style={[styles.itemText, {paddingHorizontal: 10}]}>
          {bookmarkItems[0].content}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    const {bookmarks, shuffle, minimized, contentType} = this.props;
    this.groupBookmarksBySet = _.groupBy(bookmarks, (item) => item.setId);
    const bookmarkSets = Object.keys(this.groupBookmarksBySet);
    return (
      <View style={styles.container}>
        <DraggableFlatList
          data={bookmarkSets}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `draggable-item-${item}`}
          onDragEnd={({data}) => this.setState({data})}
        />
        <View style={styles.buttonHolder}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={this.handleStart}>
            <Text style={styles.start}>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleShuffle}>
            <Image
              source={ShuffleIcon}
              style={[
                styles.shuffle,
                shuffle && {tintColor: 'rgb(60,113,222)'},
              ]}
            />
          </TouchableOpacity>
        </View>
        <RBSheet
          ref={(ref) => {
            this.RBSheet = ref;
          }}
          closeOnDragDown={true}
          onClose={this.handleClose}
          animationType={'fade'}
          closeOnPressMask={false}
          height={ScreenHeight}
          duration={430}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },
            draggableIcon: {
              backgroundColor: 'transparent',
            },
          }}>
          <Content closeSheet={this.rbsheetClose} />
        </RBSheet>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {bookmarks, contentType, minimized} = state;
  return {
    bookmarks: bookmarks.bookmarks,
    shuffle: bookmarks.shuffle,
    minimized,
    contentType,
  };
};
export default connect(mapStateToProps)(Bookmarks);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  item: {
    height: 120,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  itemText: {
    fontWeight: 'bold',
    color: colors.primary,
    fontSize: 12,
  },
  buttonHolder: {
    width: ScreenWidth,
    backgroundColor: colors.primary,
    height: 80,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  startButton: {
    width: ScreenWidth * 0.7,
    backgroundColor: 'rgb(60,113,222)',
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  start: {
    fontFamily: 'Montserrat-SemiBold',
    color: 'white',
    fontSize: 14,
  },
  shuffle: {
    height: 28,
    width: 28,
  },
});
