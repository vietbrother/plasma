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


import RNTesseractOcr from 'react-native-tesseract-ocr';
// Our custom files and classes import
import Text from '../component/Text';
import Navbar from '../component/Navbar';
import SideMenu from '../component/SideMenu';
import SideMenuDrawer from '../component/SideMenuDrawer';
import CategoryBlock from '../component/CategoryBlock';
import CategoryRootBlock from '../component/CategoryRootBlock';
import Colors from "../Colors";
import Config from "../Config";
import Product from '../component/Product';
import Camera from '../component/Camera/Camera';

import Odoo from '../Odoo';
import HTML from 'react-native-render-html';
import TextDetect from '../component/TextDetect';
import DeviceItem from "../component/Device/DeviceItem";
import Spinner from 'react-native-loading-spinner-overlay';

export default class Home extends Component {

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
            deviceSelected: {},
            customers: [],
            newStage: 0,
            oldStage: '',

            componentKey: new Date()
        };
    }


    componentDidMount() {
        // this.callApi();
        this.getSessionKey();
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        console.log(nextProps);
        console.log(nextContext);
        console.log('componentWillReceiveProps----------------nextProps.textDetect ' + nextProps.textDetect);
        //this.setState({searchText: nextProps.textDetect});
        //this.search(nextProps.textDetect);

        this.setState({componentKey: new Date(), searchText: ''});
    }

    _renderImageCamera() {
        if (this.props.capturePhotoPath != null && this.props.capturePhotoPath != '') {
            return (
                <View style={styles.image}>
                    <Image source={{uri: this.props.capturePhotoPath}} style={styles.capturePhoto}/>
                    <Text>Nhận diện mã thiết bị : <Text
                        style={{fontWeight: 'bold'}}>{this.props.textDetect == null ? '' : this.props.textDetect}</Text></Text>
                </View>
            );
        } else {
            return (
                <View>
                </View>
            );
        }
    }

    async getSessionKey() {
        try {
            const value = await AsyncStorage.getItem('cookieUserFromApi');
            console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            console.log(value);
            this.setState({sessionKey: value});
            console.log("state : " + this.state.sessionKey);
            // this._fetchCategorieData();
            // this._fetchProductsData();
            this.setState({loading: false});
        } catch (error) {
            // Handle errors here
            console.error(error);
        }
    }

    // _renderResult() {
    //     let items = [];
    //     for (var i = 0; i < this.state.products.length; i++) {
    //         var item = this.state.products[i];
    //         var key = new Date().valueOf();
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

    _renderItemResult(item) {
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

    _renderCodeProducts(code) {
        let temp = code.replace(new RegExp(this.state.searchText, "gi"), (match) => `<b style="color: dodgerblue">${match}</b>`);
        return temp;
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
            return (<Text style={{color: Config.mainColor}}> {Config.stageName0KhongXacDinh}</Text>);
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


    search() {
        console.log('home-----------------search');
        this.setState({isSearching: true});
        let items = [];
        try {
            // Connect to Odoo
            global.odooAPI.connect(this._resConnect.bind(this));

            // this.setState({searchText: codeDevice});
            var codeDevice = this.state.searchText.toUpperCase();
            var params = {
                // ids: [1, 2, 3, 4, 5],
                domain: [['code', 'like', codeDevice]],
                fields: ['id', 'code', 'stage', 'warehouse', 'p_customer', 'description'],
                order: 'id',
                limit: 100,
                offset: 0,
            }; //params
            var temp = [];
            global.odooAPI.search_read('p.equipment', params, this._getData.bind(this)); //search_read
        } catch (e) {
            console.log(e);
            this.setState({isSearching: false});
        }
    }

    _resConnect(err) {
        this.setState({isSearching: false});
        if (err) {
            console.log('--------------connect error');
            alert(Config.err_connect);
            return console.log(err);
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
        this.setState({isSearching: false, products: products});
    }

    /**
     * ===============================================================================================
     * / change stage
     * */

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
                stage: newState,
                warehouse: this._switchWarehouse(newState)
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

    _switchWarehouse(new_status) {
        if (new_status == '0') {
            return '0';
        } else if (new_status == '1') {
            return '1';
        } else if (new_status == '2') {
            return '2';
        } else if (new_status == '3') {
            return '1';
        } else {
            return '0';
        }
    }

    _renderStatusName(status) {
        if (status == '0') {
            return Config.stageName0KhongXacDinh;
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
            // global.odooAPI.connect(function (err) {
            //     if (err) {
            //         console.log('--------------connect error');
            //         this.setState({isLoading: false});
            //         alert(Config.err_connect);
            //         return console.log(err);
            //     }
            // });
            global.odooAPI.connect(this._getResConnect.bind(this));
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
                this.search();
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
        const {categories, loading} = this.state;
        if (this.state.loading == false) {
            return (
                <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}
                    // key={new Date().valueOf()}
                                key={this.state.componentKey}
                                fetchData={'1'}
                                sessionLoginKey={this.props.sessionLoginKey}>
                    <Container>
                        <Navbar left={left} right={right} title={Config.titleHome}/>
                        <Content>
                            {/*<TextDetect key={new Date().valueOf()}*/}
                            {/*capturePhotoPath={this.props.capturePhotoPath}*/}
                            {/*callback={this.search}*/}
                            {/*textDetect={this.props.textDetect}/>*/}

                            {/*<CardItem>*/}
                            {/*<Button onPress={() => Actions.cameraScanner()} transparent>*/}
                            {/*<Icon name='ios-camera' style={{color: 'green', fontSize: 23}}/>*/}
                            {/*<Text> {Config.btnScan} </Text>*/}
                            {/*</Button>*/}
                            {/*<Button onPress={() => Actions.stockOutMultiple()} transparent>*/}
                            {/*/!*<Icon name='ios-aperture' style={{color: 'green', fontSize: 16}}/>*!/*/}
                            {/*<Icon name='ios-browsers' style={{color: 'green', fontSize: 23}}/>*/}
                            {/*<Text> {Config.btnScanMultiple} </Text>*/}
                            {/*</Button>*/}
                            {/*</CardItem>*/}
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingTop: 15,
                                paddingBottom: 15
                            }}>
                                {/*<Grid>*/}
                                {/*<Col>*/}
                                {/*<TouchableOpacity onPress={() => Actions.cameraScanner()}>*/}
                                {/*<View style={{alignItems: 'center', justifyContent: 'center'}}>*/}
                                {/*<Icon name='ios-camera' style={styles.btnScanStyle}/>*/}
                                {/*<Text> {Config.btnScan} </Text>*/}
                                {/*</View>*/}
                                {/*</TouchableOpacity>*/}
                                {/*</Col>*/}
                                {/*<Col>*/}
                                {/*<TouchableOpacity onPress={() => Actions.stockOutMultiple()}>*/}
                                {/*<View style={{alignItems: 'center', justifyContent: 'center'}}>*/}
                                {/*<Icon name='ios-browsers' style={styles.btnScanStyle}/>*/}
                                {/*<Text> {Config.btnScanMultiple} </Text>*/}
                                {/*</View>*/}
                                {/*</TouchableOpacity>*/}
                                {/*</Col>*/}
                                {/*</Grid>*/}

                                <Grid style={{marginBottom: 15}}>
                                    <Col>
                                        <TouchableOpacity
                                            onPress={() => {
                                                AsyncStorage.setItem('LIST_DEVICE_IN_OUT', JSON.stringify([]));
                                                Actions.stockInOutList({
                                                    stockInType: Config.stage1Vo,
                                                    title: Config.stockInListStage1
                                                });
                                            }}>
                                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                <Icon name='md-log-in' style={styles.btnStage1}/>
                                                <Text> {Config.stockInListStage1} </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col>
                                        <TouchableOpacity
                                            onPress={() => {
                                                AsyncStorage.setItem('LIST_DEVICE_IN_OUT', JSON.stringify([]));
                                                Actions.stockInOutList({
                                                    stockInType: Config.stage3BinhTon,
                                                    title: Config.stockInListStage3
                                                });
                                            }}>
                                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                <Icon name='md-cloud-download' style={styles.btnStage3}/>
                                                <Text> {Config.stockInListStage3} </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </Col>
                                </Grid>

                                <Grid>
                                    <Col>
                                        <TouchableOpacity
                                            onPress={() => {
                                                AsyncStorage.setItem('LIST_DEVICE_IN_OUT', JSON.stringify([]));
                                                Actions.stockInOutList({
                                                    stockInType: Config.stage2TaiNap,
                                                    title: Config.stockOutListStage2
                                                });
                                            }}>
                                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                <Icon name='md-log-out' style={styles.btnStage2}/>
                                                <Text> {Config.stockOutListStage2} </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </Col>
                                    <Col>
                                        <TouchableOpacity
                                            // onPress={() => Actions.stockOutMultipleManual()}>
                                            onPress={() => {
                                            AsyncStorage.setItem('LIST_DEVICE_IN_OUT', JSON.stringify([]));
                                            Actions.stockOutMultipleManual()
                                        }}>
                                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                <Icon name='md-cloud-upload' style={styles.btnStage4}/>
                                                <Text> {Config.stockOutListStage4} </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </Col>
                                </Grid>

                                {/*<TouchableOpacity onPress={() => Actions.stockOutMultipleManual()}>*/}
                                {/*<View style={{alignItems: 'center', justifyContent: 'center'}}>*/}
                                {/*<Icon name='ios-switch' style={styles.btnScanStyle}/>*/}
                                {/*<Text> {Config.btnScanMultiple} </Text>*/}
                                {/*</View>*/}
                                {/*</TouchableOpacity>*/}
                            </View>

                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingLeft: 10,
                                paddingRight: 10
                            }}>
                                <Item>
                                    <Input
                                        placeholder="Nhập mã bình..."
                                        value={this.state.searchText}
                                        onChangeText={(text) => this.setState({searchText: text})}
                                        onSubmitEditing={() => this.search()}
                                        // style={{marginTop: 9}}
                                    />
                                    <Icon name="ios-search" style={Config.mainColor}
                                          onPress={() => this.search()}/>
                                </Item>
                                {/*<ActivityIndicator*/}
                                {/*animating={this.state.isSearching}*/}
                                {/*color={Config.mainColor}*/}
                                {/*size="large"*/}
                                {/*/>*/}
                                <Spinner
                                    //visibility of Overlay Loading Spinner
                                    visible={this.state.isSearching}
                                    //Text with the Spinner
                                    //textContent={'Đang đăng nhập ...'}
                                    //Text style of the Spinner Text
                                    textStyle={styles.spinnerTextStyle}
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
        } else {
            return <ActivityIndicator/>
        }

    }


    // renderCategories(categories) {
    //     let cat = [];
    //     console.log("render category");
    //     var urlNotFound = Config.url + '/wp-content/uploads/woocommerce-placeholder.png';
    //     for (var i = 0; i < categories.length; i++) {
    //         console.log(categories[i].id + "----parent " + categories[i].parent);
    //         // if (categories[i].parent != '0' &&  categories[i].parent == '15') {
    //         if (categories[i].parent == '0') {
    //             if (categories[i].image == null) {
    //                 categories[i].image = {src: urlNotFound};
    //             }
    //             cat.push(
    //                 <CategoryBlock key={categories[i].id} id={categories[i].id} image={categories[i].image.src}
    //                                title={categories[i].name}/>
    //             );
    //         }
    //
    //     }
    //     return cat;
    // }

    // _renderCategoriesRoot(categories) {
    //     let cat = [];
    //     console.log("render category");
    //
    //     var urlNotFound = Config.url + Config.imageDefaul;
    //     for (var i = 0; i < categories.length; i++) {
    //         // console.log(categories[i].id + "----parent " + categories[i].parent);
    //         // if (categories[i].parent != '0' &&  categories[i].parent == '15') {
    //         if (categories[i].parent == '0') {
    //             if (categories[i].image == null) {
    //                 categories[i].image = {src: urlNotFound};
    //             }
    //             cat.push(
    //                 <CategoryRootBlock key={categories[i].id} id={categories[i].id} image={categories[i].image.src}
    //                                    title={categories[i].name}/>
    //             );
    //         }
    //
    //     }
    //     return (
    //         <View
    //             style={styles.scrollContainer}
    //         >
    //             <ScrollView
    //                 horizontal
    //                 pagingEnabled
    //                 showsHorizontalScrollIndicator={false}
    //             >
    //                 {cat}
    //             </ScrollView>
    //         </View>
    //     );
    // }

    // renderFeatureProducts() {
    //     let items = [];
    //     if (this.state.products != null && this.state.products.length > 0) {
    //         let stateItems = this.state.products;
    //         for (var i = 0; i < stateItems.length; i++) {
    //             if (stateItems[i].categories != null && stateItems[i].categories.length > 0) {
    //                 items.push(
    //                     <Grid key={i}>
    //                         <Product key={stateItems[i].id} product={stateItems[i]}
    //                                  categoryId={stateItems[i].categories[0].id}
    //                                  categoryName={stateItems[i].categories[0].name}/>
    //                     </Grid>
    //                 );
    //             }
    //         }
    //     }
    //     return items;
    // }
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
    btnScanStyle: {
        color: 'green', fontSize: 40
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
    btnStage1: {
        color: Config.colorThin,
        fontSize: 40
    },
    btnStage2: {
        color: '#ff00ff',
        fontSize: 40
    },
    btnStage3: {
        color: '#c40521',
        fontSize: 40
    },
    btnStage4: {
        color: '#44bc37',
        fontSize: 40
    },
    buttonChangeState: {
        backgroundColor: 'white',
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: Config.mainColor
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

