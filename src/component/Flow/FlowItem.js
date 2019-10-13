import React, {Component} from "react";
import {
    AppRegistry,
    View,
    Text,
    Image,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Dimensions,
    ActivityIndicator,
    NativeModules, Modal, Alert
} from "react-native";

// import Key from Config.goolge_vision_key;
import RNFS from 'react-native-fs';
// import Spinner from 'react-native-spinkit';
import Config from "../../Config";
import {Col, Grid, Icon, Button} from 'native-base';
import {Actions} from 'react-native-router-flux';

// import RNTesseractOcr from 'react-native-tesseract-ocr';
import ImageResizer from 'react-native-image-resizer';
// import Odoo from "../../Odoo";

export default class FlowItem extends Component {
    constructor() {
        super()
        this.state = {
            loading: false,
            products: [],
            textDetect: '',
            responseUpdate: '',
            newStage: 0
        }
    }

    componentDidMount() {
        let textDect = this.props.textDetect == null ? '' : this.props.textDetect.trim();
        console.log(textDect);
        this.setState({textDetect: textDect});
    }

    componentWillMount(): void {
        try {
            // Connect to Odoo
            global.odooAPI.connect(function (err) {
                if (err) {
                    console.log('--------------connect error')
                    return console.log(err);
                }
            });

            let codeDevice = this.state.textDetect;
            var params = {
                domain: [['code', '=', codeDevice]],
                fields: ['id', 'code', 'stage', 'warehouse', 'p_customer', 'description'],
                order: 'id',
                limit: 15,
                offset: 0,
            }; //params
            var temp = [];
            global.odooAPI.search_read('p.equipment', params, this._getData.bind(this)); //search_read
            console.log('==========================================');
            console.log(temp);
            this.setState({loading: false, products: temp});
            // this._isLoading(false, codeDevice, temp);
        } catch (e) {
            console.log(e);
            this.setState({isSearching: false});
            // this._isLoading(false, codeDevice, []);
        }
    }

    _actionChangeStage(id, newState) {
        global.odooAPI.connect();
        try {
            // Connect to Odoo
            global.odooAPI.connect(function (err) {
                if (err) {
                    console.log('--------------connect error');
                    return console.log(err);
                }
            });

            var codeDevice = this.state.textDetect;
            var params = {
                stage: newState
            }; //params
            var temp = [];
            global.odooAPI.update('p.equipment', params, this._getResUpdate.bind(this)); //update stage
            console.log('==========================================');
            console.log(temp);
            this.setState({loading: false, products: temp});
            // this._isLoading(false, codeDevice, temp);
        } catch (e) {
            console.log(e);
            this.setState({isSearching: false});
            // this._isLoading(false, codeDevice, []);
        }
    }

    _switchStage(stage) {
        if (status == '0') {
            return 1;
        } else if (status == '4') {
            return 1;
        } else if (status == '1') {
            return 2;
        } else if (status == '2') {
            return 3;
        } else if (status == '3') {
            return 4;
        } else {
            return 0;
        }
    }

    _getData(err, products) {
        if (err) {
            alert(err);
            return console.log(err);
        }
        console.log(products);
        console.log('__________________________');
        try {
            let newStage = this._switchStage(products[0].stage);
            this.setState({newStage: newStage});
            this._actionChangeStage(products[0].id, newStage);
        } catch (e) {
            console.log(e);
            this.setState({loading: false, products: products});
        }
    }

    _getResUpdate(err, response) {
        if (err) {
            alert(err);
            return console.log(err);
        }
        console.log('_______response___________________');
        console.log(response);
        try {

            this.setState({responseUpdate: response});
        } catch (e) {
            console.log(e);
            this.setState({loading: false, products: products});
        }
    }

    _renderStatus(status) {
        if (status == '0') {
            return (<Text style={{color: '#ffa505'}}> {Config.stageName0KhongXacDinh} <Icon name="ios-help-circle-outline"
                                                                           style={styles.icon}/></Text>);
        } else if (status == '4') {
            return (<Text style={{color: '#44bc37'}}> {Config.stageName4BinhDangSuDung} <Icon name="ios-checkmark-circle"
                                                                              style={styles.icon}/> </Text>);
        } else if (status == '1') {
            return (<Text style={{color: Config.colorThin}}> {Config.stageName1Vo} <Icon name="ios-battery-dead" style={styles.icon}/>
            </Text>);
        } else if (status == '2') {
            return (<Text style={{color: '#ff00ff'}}> {Config.stageName2TaiNap} <Icon name="ios-refresh-circle" style={styles.icon}/>
            </Text>);
        } else if (status == '3') {
            return (<Text style={{color: '#c40521'}}> {Config.stageName3BinhTon} <Icon name="ios-warning" style={styles.icon}/></Text>);
        } else {
            return (<Text style={{color: '#26619c'}}>{status}</Text>);
        }
    }

    _renderMainContent() {
        let items = [];
        if (this.state.loading == false) {
            if (this.state.products.length > 0) {
                items.push(<DeviceItem products={this.state.products} textDetect={this.state.textDetect}></DeviceItem>);
                items.push(this._renderStatus(this.state.newStage));
            } else {
                items.push(<Text>Không tìm thấy thiết bị</Text>);
                items.push(<TouchableOpacity onPress={Actions.stockAdd()}>
                    <View style={styles.camBtn}>
                        <Icon name='ios-camera'/>
                        <Text style={styles.btnTxt}> Thêm thiết bị</Text>
                    </View>
                </TouchableOpacity>)
            }
        }

        return items;
    }



    render() {

        // console.log('key in verify', this.props.navigation.state.params.homeKey)

        // const { state, goBack } = this.props.navigation;

        return (
            <View style={styles.container}>
                <Text>Nhận diện mã thiết bị : <Text
                    style={{fontWeight: 'bold'}}>{this.props.textDetect == null ? '' : this.props.textDetect}</Text>
                </Text>
                <ActivityIndicator
                    animating={this.state.loading}
                    color={Config.mainColor}
                    size="large"
                />

                <View style={{marginTop: 22}}>
                    {this._renderMainContent()}


                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
        height: 400,
        width: 300
    },

    img: {
        // flexDirection: "column",
        alignItems: 'center',
        justifyContent: "center",
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width
    },
    camBtn: {
        //marginLeft:12,
        // marginTop: 15,
        flexDirection: 'column',
        marginBottom: 23,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topBar: {
        backgroundColor: "rgba(0,0,0,1)",
        height: 20,
        width: "100%"
    },

    bottomBar: {
        alignSelf: 'flex-end',
        backgroundColor: "white",
        flexDirection: 'row',
        height: 80,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    Btn: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        marginTop: 10,
    },

    goBackBtn: {
        marginLeft: 15
    },

    btnTxt: {
        color: Config.mainColor
    },

    submitBtn: {
        marginRight: 15
    },

    icon: {
        height: 25,
        width: 25
    }
});

