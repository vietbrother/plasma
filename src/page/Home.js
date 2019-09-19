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

export default class Home extends Component {

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

    componentDidMount() {
        // this.callApi();
        this.getSessionKey();
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        console.log(nextProps);
        console.log(nextContext);
        console.log('componentWillReceiveProps----------------nextProps.textDetect ' + nextProps.textDetect);
        this.setState({searchText: nextProps.textDetect});
        this.search(nextProps.textDetect);
    }

    // async callApi() {
    //     try {
    //         // console.log("================================================" + Config.goolge_vision_key);
    //         // const fetchData = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=` + Config.goolge_vision_key, {
    //         //     method: 'POST',
    //         //     headers: {
    //         //         'Accept': 'application/json',
    //         //         // 'Authorization': 'Bearer ' + Config.goolge_vision_key,
    //         //         'Content-Type': 'application/json',
    //         //     },
    //         //     body: JSON.stringify({
    //         //         "requests": [
    //         //             {
    //         //                 "image": {
    //         //                     "content": imgPath
    //         //                 },
    //         //                 "features": [
    //         //                     {
    //         //                         "type": "TEXT_DETECTION"
    //         //                     }
    //         //                 ]
    //         //             }
    //         //         ]
    //         //     })
    //         // });
    //         // console.log('finish');
    //         // console.log(JSON.stringify(fetchData));
    //         console.log("Home-----------this.props.textDetect------------------" + this.props.textDetect);
    //         if (this.props.textDetect != null) {
    //             this.setState({isSearching: true, searchText: this.props.textDetect});
    //             this.search();
    //         }
    //     } catch (err) {
    //         console.log('error:' + err);
    //     }
    // }

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

    _renderResult() {
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

    _isLoading(isSearching, codeDevice, data) {
        this.setState({isSearching: true, searchText: codeDevice, products: data});
    }

    search(codeDevice) {
        console.log('home-----------------search');
        this.setState({isSearching: true, searchText: codeDevice});
        // this._isLoading(true, codeDevice).bind;
        let items = [];
        try {
            var odoo = new Odoo({
                host: '103.94.16.226',
                port: 8069,
                database: 'plasmadb',
                username: 'admin',
                password: '1@'
            });

            // Connect to Odoo
            odoo.connect(function (err) {
                if (err) {
                    console.log('--------------connect error')
                    return console.log(err);
                }
            });

            this.setState({searchText: codeDevice});
            var params = {
                // ids: [1, 2, 3, 4, 5],
                domain: [['code', 'like', codeDevice]],
                fields: ['id', 'code', 'stage', 'warehouse', 'p_customer', 'description'],
                order: 'id',
                limit: 15,
                offset: 0,
            }; //params
            var temp = [];
            odoo.search_read('p.equipment', params, this._getData.bind(this)); //search_read
            console.log('==========================================');
            console.log(temp);
            this.setState({isSearching: false, products: temp});
            // this._isLoading(false, codeDevice, temp);
        } catch (e) {
            console.log(e);
            this.setState({isSearching: false});
            // this._isLoading(false, codeDevice, []);
        }
    }

    _getData(err, products) {
        if (err) {
            alert(err);
            return console.log(err);
        }
        console.log(products);
        console.log('__________________________');
        this.setState({isSearching: false, products: products});
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
                <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref} key={new Date().valueOf()}
                                fetchData={'1'}
                                sessionLoginKey={this.props.sessionLoginKey}>
                    <Container>
                        <Navbar left={left} right={right} title={Config.titleHome}/>
                        <Content>
                            {/*<TextDetect key={new Date().valueOf()}*/}
                            {/*capturePhotoPath={this.props.capturePhotoPath}*/}
                            {/*callback={this.search}*/}
                            {/*textDetect={this.props.textDetect}/>*/}

                            <CardItem>
                                <Button onPress={() => Actions.cameraScanner()} transparent>
                                    <Icon name='ios-camera' style={{color: 'green', fontSize: 16}}/>
                                    <Text> {Config.btnScan} </Text>
                                </Button>
                                <Button onPress={() => Actions.stockOutMultiple()} transparent>
                                    {/*<Icon name='ios-aperture' style={{color: 'green', fontSize: 16}}/>*/}
                                    <Icon name='ios-filling' style={{color: 'green', fontSize: 16}}/>
                                    <Text> {Config.btnScanMultiple} </Text>
                                </Button>
                            </CardItem>

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
                                        value={this.state.searchText}
                                        onChangeText={(text) => this.setState({searchText: text})}
                                        // onSubmitEditing={() => this.search(this.state.searchText)}
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

                                {this._renderResult()}
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

