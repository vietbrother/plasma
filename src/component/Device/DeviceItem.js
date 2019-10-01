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
import Spinner from 'react-native-loading-spinner-overlay';

export default class DeviceItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            products: [],
            isLoading: false,
            isSearching: false,
            error: null,
            sessionKey: null,

            extractedText: "",
            searchText: '',
            device: {}
        };
    }

    componentDidMount(): void {
        this.setState({device: this.props.device});
        console.log(this.props.device);
    }

    render() {
        return (
            <View style={{
                flex: 1,
                width: '100%', color: Config.mainColor, fontSize: 16,
                borderBottomColor: Colors.navbarBackgroundColor, borderBottomWidth: 1,
                paddingLeft: 10,
                paddingTop: 20, paddingBottom: 20
            }}>
                <Spinner
                    //visibility of Overlay Loading Spinner
                    visible={this.state.isLoading}
                    //Text with the Spinner
                    //textContent={'Đang đăng nhập ...'}
                    //Text style of the Spinner Text
                    textStyle={styles.spinnerTextStyle}
                />
                {this._renderMainContent()}
                {this._renderButton(this.props.device)}
            </View>
        );
    }

    _renderButton(device) {
        return (
            <CardItem>
                <Left>

                </Left>

                <Right>
                    <Button style={styles.buttonChangeState}
                        onPress={() => {this._actionChangeStage(this.props.device)}} >
                        <Icon name="ios-git-compare"></Icon>
                        <Text style={{color: Config.mainColor, marginLeft: 5}}>Chuyển trạng thái</Text>
                    </Button>
                </Right>
            </CardItem>
        );
    }

    _actionChangeStage(device){
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
                'Chuyển trạng thái bình ' + this.props.device.code, // <- this part is optional, you can pass an empty string
                [
                    {
                        text: 'Chuyển trạng thái bình',
                        onPress: () => this._fetchChangeStage(device.id, newStage)
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

    _fetchChangeStage(id, newState) {
        try {
            this.setState({isLoading: true});
            console.log('--------------id ' + id + "---newState  " + newState);
            // Connect to Odoo
            global.odooAPI.connect(this._getResConnect.bind(this));

            var codeDevice = this.props.device.code;
            var params = {
                stage: newState
            }; //params
            global.odooAPI.update('p.equipment', id, params, this._getResUpdate.bind(this)); //update stage
        } catch (e) {
            console.log(e);
            alert('Chuyển trạng thái bình ' + this.props.device.code + ' thất bại! ');
            this.setState({isLoading: false});
        }
    }
    _getResConnect(err){
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
            alert('Chuyển trạng thái mã bình ' + this.props.device.code + ' thất bại! ');
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
            return 'Bình đang sử dụng';
        } else if (status == '1') {
            return 'Vỏ';
        } else if (status == '2') {
            return 'Tái nạp';
        } else if (status == '3') {
            return 'Bình tồn';
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
            var device_id = this.props.device.id;
            var device_code = this.props.device.code;
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
                alert('Chuyển trạng thái mã bình ' + this.props.device.code + ' từ '
                    + this._renderStatus(this.state.oldStage)
                    + ' sang ' + this._renderStatus(this.state.newStage));
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


    _renderMainContent() {
        return (
            <TouchableOpacity
                onPress={() => Actions.deviceDetail({device: this.props.device})}
                activeOpacity={0.9}
            >
                <Grid>
                    <Col size={2}>
                        <Text style={{fontWeight: 'bold', fontSize: 16}}><Icon name="ios-pricetag"
                                                                               style={styles.icon}/> Mã bình
                            :</Text>
                    </Col>
                    <Col size={3}>
                        <Text style={{textAlign: 'center'}}>
                            {this._renderStatus(this.props.device.code)}
                        </Text>
                    </Col>
                </Grid>
                <Grid>
                    <Col size={2}>
                        <Text style={{fontWeight: 'bold'}}><Icon name="ios-time" style={styles.icon}/> Trạng thái
                            :</Text>
                    </Col>
                    <Col size={3}>
                        <Text style={{textAlign: 'center'}}>
                            {this._renderStatus(this.props.device.stage)}
                        </Text>
                    </Col>
                </Grid>
                <Grid>
                    <Col size={2}>
                        <Text style={{fontWeight: 'bold'}}><Icon name="md-locate" style={styles.icon}/> Kho :</Text>
                    </Col>
                    <Col size={3}>
                        <Text style={{textAlign: 'center'}}>
                            {this._renderWarehouse(this.props.device.warehouse)}
                        </Text>
                    </Col>
                </Grid>

                <Grid>
                    <Col size={2}>
                        <Text style={{fontWeight: 'bold'}}><Icon name="ios-contact" style={styles.icon}/> Khách hàng
                            :</Text>
                    </Col>
                    <Col size={3}>
                        <Text style={{textAlign: 'center'}}>
                            {this.props.device.p_customer == null
                            || this.props.device.p_customer == false
                            || this.props.device.p_customer.length < 2 ? 'Chưa có' : this.props.device.p_customer[1]}
                        </Text>
                    </Col>

                </Grid>
            </TouchableOpacity>
        );


    }


    _renderStatus(status) {
        if (status == '0') {
            return (<Text style={{color: '#ffa505'}}>
                <Icon name="ios-help-circle-outline"
                      style={{fontSize: 13, color: '#ffa505'}}/>
                Không xác định</Text>);
        } else if (status == '4') {
            return (<Text style={{color: '#44bc37'}}>
                <Icon name="ios-checkmark-circle"
                      style={{fontSize: 13, color: '#44bc37'}}/>
                Bình đang sử dụng </Text>);
        } else if (status == '1') {
            return (<Text style={{color: Config.colorThin}}>
                <Icon name="ios-battery-dead"
                      style={{fontSize: 13, color: Config.colorThin}}/>
                Vỏ </Text>);
        } else if (status == '2') {
            return (<Text style={{color: '#ff00ff'}}>
                <Icon name="ios-refresh-circle"
                      style={{fontSize: 13, color: '#ff00ff'}}/>
                Tái nạp </Text>);
        } else if (status == '3') {
            return (<Text style={{color: '#c40521'}}>
                <Icon name="ios-warning"
                      style={{fontSize: 13, color: '#c40521'}}/>
                Bình tồn </Text>);
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
    },
    buttonChangeState: {
        backgroundColor: 'white',
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: Config.mainColor
    }
});
