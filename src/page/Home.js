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
    NativeModules
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
    Col
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


export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            products: [],
            isLoading: true,
            error: null,
            sessionKey: null,

            extractedText: "",
        };
    }

    componentWillMount() {
        this.getSessionKey();
    }


    async getSessionKey() {
        try {
            const value = await AsyncStorage.getItem('cookieUserFromApi');
            console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            console.log(value);
            this.setState({sessionKey: value});
            console.log("state : " + this.state.sessionKey);
            this._fetchCategorieData();
            this._fetchProductsData();
        } catch (error) {
            // Handle errors here
            console.error(error);
        }
    }

    _fetchCategorieData() {
        //Have a try and catch block for catching errors.
        try {
            //this.getSessionKey();
            this.setState({isLoading: true});
            global.WooCommerceAPI.get('products/categories', {
                per_page: 100, status: 'processing', page: 1
            })
                .then(data => {
                    // data will contain the body content from the request
                    console.log("get category");
                    this.setState({categories: data, loading: false});
                })
                .catch(error => {
                    // error will return any errors that occur
                    console.log(error);
                    this.setState({
                        error: error.toString(),
                        isLoading: false
                    });
                });
        } catch (err) {
            console.log("Error fetching data-----------", err);
        }
    }

    _fetchProductsData() {
        this.setState({loading: true});
        global.WooCommerceAPI.get('products', {
            featured: true
        })
            .then(data => {
                console.log("=============================Home Fetch API-----------------");
                // console.log(data);
                this.setState({products: data, loading: false});
            }).catch(error => {
            // error will return any errors that occur
            console.log(error);
        });
    }


    extractTextFromImage(imagePath) {
        const tessOptions = {
            whitelist: null,
            blacklist: null
        };
        RNTesseractOcr.recognize(imagePath, 'LANG_ENGLISH', tessOptions)
            .then((result) => {
                this.setState({ isLoading: false, extractedText: result });
            })
            .catch((err) => {
                this.setState({ isLoading: false, extractedText: err.message });
            });
    }
    renderDetectText(){
        this.extractTextFromImage('../images/logo.png');
        return (
            <Text>{this.state.extractedText}</Text>
        );
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
                <Button onPress={() => Actions.search()} transparent>
                    <Icon name='ios-search-outline'/>
                </Button>
                <Button onPress={() => Actions.cart()} transparent>
                    <Icon name='ios-cart'/>
                </Button>
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
                            <View style={styles.titleView}>
                                <Text style={styles.title}> DANH MỤC SẢN PHẨM </Text>
                            </View>
                            {/*{this._renderCategoriesRoot(this.state.categories)}*/}

                            <View style={styles.titleView}>
                                <Text style={styles.title}> SẢN PHẨM NỔI BẬT </Text>
                            </View>
                            {/*{this.renderFeatureProducts()}*/}
                            <Button onPress={() => Actions.camera()} transparent>
                                <Icon name='ios-camera' style={{color: 'green'}}/>
                            </Button>
                            {this.renderPhoto()}
                            {/*{this.renderDetectText()}*/}

                        </Content>
                    </Container>
                </SideMenuDrawer>);
        } else {
            return <ActivityIndicator/>
        }

    }

    async renderPhoto(){
        var imgPath = `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`;
        try {
            const fetchData = await fetch(`https://vision.googleapis.com/v1/images:annotate`, {
                method: 'POST',
                headers: {
                    //'Accept': 'application/json',
                    'Authorization': 'Bearer ' + Config.goolge_vision_key,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "requests": [
                        {
                            "image": {
                                "content": imgPath
                            },
                            "features": [
                                {
                                    "type": "TEXT_DETECTION"
                                }
                            ]
                        }
                    ]
                })
            });
            console.log(JSON.stringify(fetchData));

        } catch (err) {
            console.log({err})
        }
        if(this.props.capturePhotoPath != null && this.props.capturePhotoPath != ''){
            return (
                <View style={styles.container}>
                    <Image source={{uri: this.props.capturePhotoPath}} style={styles.capturePhoto}/>
                    <Text>{this.props.textDetect == null ? '' : this.props.textDetect}</Text>
                </View>
            );
        }

    }
    renderCategories(categories) {
        let cat = [];
        console.log("render category");
        var urlNotFound = Config.url + '/wp-content/uploads/woocommerce-placeholder.png';
        for (var i = 0; i < categories.length; i++) {
            console.log(categories[i].id + "----parent " + categories[i].parent);
            // if (categories[i].parent != '0' &&  categories[i].parent == '15') {
            if (categories[i].parent == '0') {
                if (categories[i].image == null) {
                    categories[i].image = {src: urlNotFound};
                }
                cat.push(
                    <CategoryBlock key={categories[i].id} id={categories[i].id} image={categories[i].image.src}
                                   title={categories[i].name}/>
                );
            }

        }
        return cat;
    }

    _renderCategoriesRoot(categories) {
        let cat = [];
        console.log("render category");

        var urlNotFound = Config.url + Config.imageDefaul;
        for (var i = 0; i < categories.length; i++) {
            // console.log(categories[i].id + "----parent " + categories[i].parent);
            // if (categories[i].parent != '0' &&  categories[i].parent == '15') {
            if (categories[i].parent == '0') {
                if (categories[i].image == null) {
                    categories[i].image = {src: urlNotFound};
                }
                cat.push(
                    <CategoryRootBlock key={categories[i].id} id={categories[i].id} image={categories[i].image.src}
                                       title={categories[i].name}/>
                );
            }

        }
        return (
            <View
                style={styles.scrollContainer}
            >
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                >
                    {cat}
                </ScrollView>
            </View>
        );
    }

    renderFeatureProducts() {
        let items = [];
        if (this.state.products != null && this.state.products.length > 0) {
            let stateItems = this.state.products;
            for (var i = 0; i < stateItems.length; i++) {
                if (stateItems[i].categories != null && stateItems[i].categories.length > 0) {
                    items.push(
                        <Grid key={i}>
                            <Product key={stateItems[i].id} product={stateItems[i]}
                                     categoryId={stateItems[i].categories[0].id}
                                     categoryName={stateItems[i].categories[0].name}/>
                        </Grid>
                    );
                }
            }
        }
        return items;
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
    }
});

