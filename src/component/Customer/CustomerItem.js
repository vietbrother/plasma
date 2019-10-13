/**
 * This is the Side Menu Drawer Component
 **/

// React native and others libraries imports
import React, {Component} from 'react';
import {
    Image,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    NativeModules,
    Dimensions,
    AsyncStorage, Keyboard, StyleSheet
} from 'react-native';
import {
    Container,
    Content,
    View,
    Button,
    Left,
    Right,
    Icon,
    Card,
    CardItem,
    cardBody,
    Row,
    Grid,
    Col,
    Item,
    Input, List, ListItem,
    // Text
} from 'native-base';
import {Actions} from 'react-native-router-flux';


// Our custom files and classes import
import Text from '../../component/Text';
import Navbar from '../../component/Navbar';
import Colors from "../../Colors";
import Config from "../../Config";
import HTML from 'react-native-render-html';

export default class CustomerItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            products: [],
            isLoading: true,
            isSearching: false,
            error: null,
            sessionKey: null,

            extractedText: "",
            searchText: '',
            device: {}
        };
    }

    componentDidMount(): void {
        this.setState({name: this.props.customer.name, address: this.props.customer.address});
    }

    render() {
        return (
            <View style={{
                flex: 1,
                width: '100%', color: Config.mainColor, fontSize: 16,
                borderBottomColor: Colors.navbarBackgroundColor, borderBottomWidth: 0.5,
                paddingLeft: 10,
                paddingTop: 20, paddingBottom: 20
            }}>
                {this._renderMainContent()}
            </View>
        );
    }


    _renderMainContent() {
        return (
            <TouchableOpacity
                onPress={() => Actions.customerDetail({customer: this.props.customer})}
                activeOpacity={0.9}
            >
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>{this.state.name}</Text>
                <Text style={{textAlign: 'left'}}>
                    <Icon active name='ios-pin' style={{fontSize: 14, color: "#687373", paddingRight: 5}} />
                    {this.state.address}
                </Text>
            </TouchableOpacity>
        );


    }


    _renderStatus(status) {
        if (status == '0') {
            return (<Text style={{color: '#ffa505'}}>
                <Icon name="ios-help-circle-outline"
                      style={{fontSize: 13, color: '#ffa505'}}/>
                {Config.stageName0KhongXacDinh}</Text>);
        } else if (status == '4') {
            return (<Text style={{color: '#44bc37'}}>
                <Icon name="ios-checkmark-circle"
                      style={{fontSize: 13, color: '#44bc37'}}/>
                {Config.stageName4BinhDangSuDung} </Text>);
        } else if (status == '1') {
            return (<Text style={{color: Config.colorThin}}>
                <Icon name="ios-battery-dead"
                      style={{fontSize: 13, color: Config.colorThin}}/>
                {Config.stageName1Vo} </Text>);
        } else if (status == '2') {
            return (<Text style={{color: '#ff00ff'}}>
                <Icon name="ios-refresh-circle"
                      style={{fontSize: 13, color: '#ff00ff'}}/>
                {Config.stageName2TaiNap} </Text>);
        } else if (status == '3') {
            return (<Text style={{color: '#c40521'}}>
                <Icon name="ios-warning"
                      style={{fontSize: 13, color: '#c40521'}}/>
                {Config.stageName3BinhTon} </Text>);
        } else {
            return (<Text style={{color: '#26619c'}}>{status}</Text>);
        }
    }

    _renderWarehouse(warehouse) {
        if (warehouse == '0') {
            return (<Text style={{color: Config.mainColor}}> Không xác định</Text>);
        } else if (warehouse == '1') {
            return (<Text style={{color: Config.mainColor}}> Kho công ty</Text>);
        } else if (warehouse == '2') {
            return (<Text style={{color: Config.mainColor}}> Kho nhà máy</Text>);
        } else if (warehouse == '3') {
            return (<Text style={{color: Config.mainColor}}> Kho khách hàng</Text>);
        } else {
            return (<Text style={{color: Config.mainColor}}>{warehouse}</Text>);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
    },
    scrollContainer: {
        // height: 150,
        marginTop: 5,
        paddingRight: 5,
        paddingLeft: 5,
        paddingBottom: 20
    },
    image: {
        width: 160,
        height: 160,
        borderRadius: 10,
        marginRight: 5,
        borderColor: '#dfe3ee',
        borderWidth: 0.5
    },
    capturePhoto: {
        width: 180,
        height: 180,
        borderRadius: 10,
        // marginRight: 5,
        borderColor: '#dfe3ee',
        borderWidth: 0.5
    },

    line: {
        width: '47%',
        height: 3,
        backgroundColor: '#7f8c8d',
        position: 'absolute',
        bottom: '0%',
        marginLeft: 5
    },
    titleView: {
        flex: 1, width: '97%',
        backgroundColor: Config.mainColor,
        borderRadius: 5,
        borderWidth: 0.5,
        margin: 5,
    },
    title: {
        fontSize: 16, fontFamily: 'Roboto',
        fontWeight: '200',
        color: 'white',
        margin: 10,
    },
    icon: {
        fontSize: 13
    }
});
