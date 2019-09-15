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


import RNTesseractOcr from 'react-native-tesseract-ocr';
// Our custom files and classes import
import Text from '../component/Text';
import Navbar from '../component/Navbar';
import Colors from "../Colors";
import Config from "../Config";
import Product from '../component/Product';
import Camera from '../component/Camera/Camera';

import Odoo from '../Odoo';
import HTML from 'react-native-render-html';

export default class DeviceItem extends Component {
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
        };
    }

    render() {
        return (
            <View>
                {this._renderMainContent()}
            </View>
        );
    }

    componentDidMount() {
        let textDect = this.props.textDetect == null ? '' : this.props.textDetect.trim();
        this.setState({extractedText: textDect, products: this.props.products});
    }


    _renderMainContent() {
        let items = [];
        for (var i = 0; i < this.state.products.length; i++) {
            var item = this.state.products[i];
            var key = new Date().valueOf();
            items.push(
                <View style={{
                    width: '100%', color: Config.mainColor, fontSize: 16,
                    borderBottomColor: Colors.navbarBackgroundColor, borderBottomWidth: 1,
                    paddingLeft: 10,
                    paddingTop: 20, paddingBottom: 20
                }}>
                    <Grid>
                        <Col size={3}>
                            <Text style={{fontWeight: 'bold', fontSize: 16}}><Icon name="ios-pricetag"
                                                                                   style={styles.icon}/> Mã bình
                                :</Text>
                        </Col>
                        <Col size={2}>
                            <HTML
                                html={this._renderCodeProducts(item.code)}
                                classesStyles={{
                                    fontFamily: 'Roboto',
                                    color: 'red',
                                    fontSize: 18, fontWeight: 'bold'
                                }}
                            />
                        </Col>
                    </Grid>
                    <Grid>
                        <Col size={2}>
                            <Text style={{fontWeight: 'bold'}}><Icon name="ios-time" style={styles.icon}/> Trạng thái :</Text>
                        </Col>
                        <Col size={3}>
                            <Text style={{textAlign: 'center'}}>
                                {this._renderStatus(item.stage)}
                            </Text>
                        </Col>
                    </Grid>
                    <Grid>
                        <Col size={2}>
                            <Text style={{fontWeight: 'bold'}}><Icon name="md-locate" style={styles.icon}/> Kho :</Text>
                        </Col>
                        <Col size={3}>
                            <Text style={{textAlign: 'center'}}>
                                {this._renderWarehouse(item.warehouse)}
                            </Text>
                        </Col>
                    </Grid>

                    <Grid>
                        <Col size={2}>
                            <Text style={{fontWeight: 'bold'}}><Icon name="ios-contact" style={styles.icon}/> Khách hàng
                                :</Text>
                        </Col>
                        <Col size={3}>
                            <Text
                                style={{textAlign: 'center'}}>{item.p_customer == null || item.p_customer == false || item.p_customer.length < 2 ? 'Chưa có' : item.p_customer[1]}
                            </Text>
                        </Col>

                    </Grid>
                </View>
            );
        }
        return items;

    }

    _renderCodeProducts(code) {
        let temp = code.replace(new RegExp(this.state.searchText, "gi"), (match) => `<b style="color: dodgerblue">${match}</b>`);
        return temp;
    }

    _renderStatus(status) {
        if (status == '0') {
            return (<Text style={{color: '#ffa505'}}> Không xác định <Icon name="ios-help-circle-outline"
                                                                           style={styles.icon}/></Text>);
        } else if (status == '4') {
            return (<Text style={{color: '#44bc37'}}> Bình đang sử dụng <Icon name="ios-checkmark-circle"
                                                                              style={styles.icon}/> </Text>);
        } else if (status == '1') {
            return (<Text style={{color: Config.colorThin}}> Vỏ <Icon name="ios-battery-dead" style={styles.icon}/>
            </Text>);
        } else if (status == '2') {
            return (<Text style={{color: '#ff00ff'}}> Tái nạp <Icon name="ios-refresh-circle" style={styles.icon}/>
            </Text>);
        } else if (status == '3') {
            return (<Text style={{color: '#c40521'}}> Bình tồn <Icon name="ios-warning" style={styles.icon}/></Text>);
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
