/**
 * This is the Home page
 **/

// React native and others libraries imports
import React, {Component} from 'react';
import {
    Image,
    ActivityIndicator,
    AsyncStorage,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    NativeModules,
    Dimensions,
    Alert,
    FlatList
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


import Text from '../../component/Text';
import Navbar from '../../component/Navbar';
import SideMenu from '../../component/SideMenu';
import SideMenuDrawer from '../../component/SideMenuDrawer';
import Colors from "../../Colors";
import Config from "../../Config";
import HTML from 'react-native-render-html';
import DeviceItem from "../../component/Device/DeviceItem";


export default class Devices extends Component {

    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            products: [],
            // isLoading: true,
            isSearching: false,
            error: null,
            sessionKey: null,

            extractedText: "",
            searchText: '',
            deviceSelected: {},
            componentKey: new Date()
        };
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        this.setState({componentKey: new Date(), searchText: ''});
    }

    componentDidMount() {
        this.search();
    }

    // _renderResult() {
    //     let items = [];
    //     for (var i = 0; i < this.state.products.length; i++) {
    //         var item = this.state.products[i];
    //         var key = new Date().valueOf();
    //         console.log(item);
    //         {/*<DeviceItem key={key + '_' + i} device={item}></DeviceItem>*/
    //         }
    //         items.push(
    //             <View style={{
    //                 flex: 1,
    //                 width: '100%', color: Config.mainColor, fontSize: 16,
    //                 borderBottomColor: Colors.navbarBackgroundColor, borderBottomWidth: 0.5,
    //                 paddingLeft: 10,
    //                 paddingTop: 10, paddingBottom: 10
    //             }}>
    //                 <DeviceItem key={key + '_' + i} device={item}></DeviceItem>
    //                 {this._renderButton(item)}
    //             </View>
    //         );
    //     }
    //     return items;
    //
    // }

    _renderItemResult(item){
        var key = new Date().valueOf();
        return (
            <View style={{
                flex: 1,
                width: '100%', color: Config.mainColor, fontSize: 16,
                borderBottomColor: Colors.navbarBackgroundColor, borderBottomWidth: 0.5,
                paddingLeft: 10,
                paddingTop: 10, paddingBottom: 10
            }}>
                <DeviceItem key={key} device={item}></DeviceItem>
                {this._renderButton(item)}
            </View>
        );
    }

    search() {
        console.log('devices-----------------search');
        this.setState({isSearching: true});
        let items = [];
        try {
            // Connect to Odoo
            global.odooAPI.connect(this._getResConnect.bind(this));

            var params = {
                // ids: [1, 2, 3, 4, 5],
                domain: [['code', 'like', this.state.searchText.toUpperCase()]],
                fields: ['id', 'code', 'stage', 'warehouse', 'p_customer', 'description'],
                order: 'code',
                limit: 100,
                offset: 0,
            }; //params
            global.odooAPI.search_read('p.equipment', params, this._getData.bind(this)); //search_read
        } catch (e) {
            console.log(e);
            this.setState({isSearching: false});
        }
    }

    _getData(err, products) {
        this.setState({isSearching: false});
        if (err) {
            alert(err);
            return console.log(err);
        }
        // console.log(products);
        console.log('__________________________');
        this.setState({products: products});
    }


    _renderButton(device) {
        return (
            <CardItem>
                <Left style={{flex: 1}}></Left>
                <Right>
                    <Button transparent
                            onPress={() => {
                                this._actionChangeStage(device)
                            }}>
                        <Icon name="ios-git-compare" style={{color: Config.mainColor}}></Icon>
                        <Text style={{color: Config.mainColor}}>Chuyển trạng thái</Text>
                    </Button>
                </Right>
            </CardItem>
        );
    }

    _actionChangeStage(device) {
        this.setState({deviceSelected: device});
        var newStage = this._switchStage(device.stage);
        if (newStage == '4') {//chuyen trang thai tu binh ton sang xuat cho khach
            Alert.alert(
                '',
                'Xuất bình ' + device.code + ' cho khách', // <- this part is optional, you can pass an empty string
                [
                    {
                        text: 'Xuất cho khách',
                        onPress: () => Actions.stockOut({
                            textDetect: device.code,
                            deviceInfo: device
                        })
                    },
                    {
                        text: 'Hủy',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                ],
                {cancelable: true},
            );
            return;
        } else {
            Alert.alert(
                '',
                'Chuyển trạng thái bình ' + device.code, // <- this part is optional, you can pass an empty string
                [
                    {
                        text: 'Chuyển trạng thái bình',
                        onPress: () => this._fetchChangeStage(device, newStage)
                    },
                    {
                        text: 'Hủy',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                ],
                {cancelable: true},
            );
        }
        this.setState({newStage: newStage, oldStage: device.stage});

    }

    _fetchChangeStage(device, newState) {
        try {
            this.setState({isLoading: true});
            console.log('--------------id ' + device.id + "---newState  " + newState);
            // Connect to Odoo
            global.odooAPI.connect(this._getResConnect.bind(this));

            var codeDevice = device.code;
            var params = {
                stage: newState
            }; //params
            global.odooAPI.update('p.equipment', device.id, params, this._getResUpdate.bind(this)); //update stage
        } catch (e) {
            console.log(e);
            alert('Chuyển trạng thái bình ' + device.code + ' thất bại! ');
            this.setState({isLoading: false});
        }
    }

    _getResConnect(err) {
        if (err) {
            console.log('--------------connect error');
            this.setState({isLoading: false});
            alert(Config.err_connect);
            return console.log(err);
        }
    }

    _getResUpdate(err, response) {
        if (err) {
            this.setState({isLoading: false});
            alert(err);
            return console.log(err);
        }
        console.log('_______response___________________');
        console.log(response);
        try {
            this.setState({responseUpdate: response});
            this._createOrder('0');
        } catch (e) {
            console.log(e);
            alert('Chuyển trạng thái mã bình ' + this.state.deviceSelected.code + ' thất bại! ');
            this.setState({isLoading: false});
        }
    }


    _switchStage(status) {
        if (status == '0') {
            return '1';
        } else if (status == '4') {
            return '1';
        } else if (status == '1') {
            return '2';
        } else if (status == '2') {
            return '3';
        } else if (status == '3') {
            return '4';
        } else {
            return '0';
        }
    }

    _renderStatusName(status) {
        if (status == '0') {
            return 'Không xác định';
        } else if (status == '4') {
            return Config.stageName4BinhDangSuDung;
        } else if (status == '1') {
            return Config.stageName1Vo;
        } else if (status == '2') {
            return Config.stageName2TaiNap;
        } else if (status == '3') {
            return Config.stageName3BinhTon;
        } else {
            return {status};
        }
    }


    /**
     * Create order
     * */
    _createOrder(customerId) {
        try {
            var oldStage = this.state.oldStage;
            var dateTime = new Date().toISOString();
            var dateStr = dateTime.split('T')[0].replace(/-/g, '').replace(/:/g, '')
            var dateTimeStr = dateTime.split('.')[0].replace('T', '_').replace(/-/g, '').replace(/:/g, '');

            var orderCode = '';
            var orderCustomerId = '';
            var orderType = '';
            var device_id = this.state.deviceSelected.id;
            var device_code = this.state.deviceSelected.code;
            //TYPE = [(0, 'Không xác định'), (1, 'Thu hồi'), (2, 'Xuất tái nạp'), (3, 'Nhập kho'), (4, 'Xuất cho khách')]
            if (oldStage == '0') {
                orderCode = dateTimeStr + 'Thu_hoi_' + device_code;
                orderType = Config.orderType1ThuHoi;
                orderCustomerId = '1';// cong ty
            } else if (oldStage == '4') {
                orderCode = dateTimeStr + 'Thu_hoi_' + device_code;
                orderType = Config.orderType1ThuHoi;
                orderCustomerId = '1';// cong ty
            } else if (oldStage == '1') {
                orderCode = dateTimeStr + 'Xuat_tai_nap_' + device_code;
                orderType = Config.orderType2XuatTaiNap;
                orderCustomerId = '2';// nha may
            } else if (oldStage == '2') {
                orderCode = dateTimeStr + 'Nhap_kho_' + device_code;
                orderType = Config.orderType3NhapKho;
                orderCustomerId = '1';// cong ty
            } else if (oldStage == '3') {
                orderCode = dateTimeStr + 'Xuat_cho_khach_' + device_code;
                orderType = Config.orderType4XuatChoKhach;
                orderCustomerId = customerId;// khach hang
            } else {
                alert('Trạng thái thiết bị không đúng')
                return;
            }

            // Connect to Odoo
            global.odooAPI.connect(function (err) {
                if (err) {
                    console.log('--------------connect error');
                    this.setState({isLoading: false});
                    alert(Config.err_connect);
                    return console.log(err);
                }
            });
            var params = {
                p_equipments: [(6, 0, device_id)],
                code: orderCode,
                type: orderType,
                p_customer: orderCustomerId
            }; //params
            global.odooAPI.create('p.order', params, this._getResCreateOrder.bind(this)); //update stage

        } catch (e) {
            console.log(e);
            Alert.alert(
                '',
                'Chuyển trạng thái thành công! Lỗi khi tạo đơn hàng!', // <- this part is optional, you can pass an empty string
                [
                    {text: 'Đóng', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
            );
            this.setState({isLoading: false});
        }
    }

    _getResCreateOrder(err, response) {
        this.setState({isLoading: false});
        if (err) {
            alert(err);
            return console.log(err);
        }
        console.log('_______response__create_________________');
        console.log(response);
        try {
            if (response != null) {
                alert('Chuyển trạng thái mã bình ' + this.state.deviceSelected.code + ' từ '
                    + this._renderStatusName(this.state.oldStage)
                    + ' sang ' + this._renderStatusName(this.state.newStage));
            } else {
                alert(Config.err_order_add);
            }
        } catch (e) {
            console.log(e);
            this.setState({isLoading: false});
            Alert.alert(
                '',
                'Chuyển trạng thái thành công! Lỗi khi tạo đơn hàng!', // <- this part is optional, you can pass an empty string
                [
                    {text: 'Đóng', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
            );
        }
    }


    render() {
        var left = (
            <Left style={{flex: 1}}>
                <Button onPress={() => this._sideMenuDrawer.open()} transparent>
                    <Icon name='ios-menu-outline'/>
                </Button>
            </Left>
        );
        var right = (
            <Right style={{flex: 1}}>
                {/*<Button onPress={() => Actions.search()} transparent>*/}
                {/*<Icon name='ios-search-outline'/>*/}
                {/*</Button>*/}
                {/*<Button onPress={() => Actions.cart()} transparent>*/}
                {/*<Icon name='ios-cart'/>*/}
                {/*</Button>*/}
            </Right>
        );

        return (
            <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}
                            key={this.state.componentKey}
                // key={new Date().valueOf()}
                // fetchData={'1'}
                // sessionLoginKey={this.props.sessionLoginKey}
            >
                <Container>
                    <Navbar left={left} right={right} title={Config.deviceList}/>
                    <Content>
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingLeft: 10,
                            paddingRight: 10
                        }}>
                            <Item>
                                <Input
                                    placeholder="Tìm kiếm bình..."
                                    // value={this.state.searchText}
                                    onChangeText={(text) => this.setState({searchText: text})}
                                    onSubmitEditing={() => this.search(this.state.searchText)}
                                    // style={{marginTop: 9}}
                                />
                                <Icon name="ios-search" style={Config.mainColor}
                                      onPress={() => this.search(this.state.searchText)}/>
                            </Item>
                            <ActivityIndicator
                                animating={this.state.isSearching}
                                color={Config.mainColor}
                                size="large"
                            />
                            {/*{this._renderResult()}*/}

                            <FlatList
                                style={{width: '100%'}}
                                data={this.state.products}
                                renderItem={({item}) => this._renderItemResult(item)}
                            />
                        </View>

                    </Content>
                </Container>
            </SideMenuDrawer>);
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
        width: 120,
        height: 120,
        borderRadius: 10,
        marginRight: 5,
        borderColor: '#dfe3ee',
        borderWidth: 0.5
    },
    capturePhoto: {
        width: 120,
        height: 120,
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
    },
    stage0: {
        color: '#ffa505'
    },
    stage1: {
        color: Config.colorThin
    },
    stage2: {
        color: '#ff00ff'
    },
    stage3: {
        color: '#c40521'
    },
    stage4: {
        color: '#44bc37'
    },
});

const _styles = {
    font: {
        fontFamily: 'Roboto',
        color: Colors.navbarBackgroundColor
    },
    icon: {
        fontSize: 13
    },
    stage0: {
        color: '#ffa505'
    },
    stage1: {
        color: Config.colorThin
    },
    stage2: {
        color: '#ff00ff'
    },
    stage3: {
        color: '#c40521'
    },
    stage4: {
        color: '#44bc37'
    },

};

