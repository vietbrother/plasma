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

export default class OrderItem extends Component {
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
            device: {},
            order: {}
        };
    }

    componentDidMount(): void {
        this.setState({order: this.props.order});
        console.log(this.props.order);
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
                onPress={() => Actions.orderDetail({order: this.props.order})}
                activeOpacity={0.9}
            >
                <Grid>
                    <Col size={2}>
                        <Text style={{fontWeight: 'bold', fontSize: 16}}><Icon name="ios-pricetag"
                                                                               style={styles.icon}/> {Config.orderCode}
                            :</Text>
                    </Col>
                    <Col size={3}>
                        <Text style={{textAlign: 'center'}}>
                            {this.props.order.code}
                        </Text>
                    </Col>
                </Grid>
                <Grid>
                    <Col size={2}>
                        <Text style={{fontWeight: 'bold'}}><Icon name="ios-time" style={styles.icon}/> {Config.orderDate}
                            :</Text>
                    </Col>
                    <Col size={3}>
                        <Text style={{textAlign: 'center'}}>
                            {this.props.order.create_date}
                        </Text>
                    </Col>
                </Grid>

                <Grid>
                    <Col size={2}>
                        <Text style={{fontWeight: 'bold'}}><Icon name="ios-contact" style={styles.icon}/> {Config.orderCustomer}
                            :</Text>
                    </Col>
                    <Col size={3}>
                        <Text style={{textAlign: 'center'}}>
                            {this.props.order.p_customer == null
                            || this.props.order.p_customer == false
                            || this.props.order.p_customer.length < 2 ? 'Chưa có' : this.props.order.p_customer[1]}
                        </Text>
                    </Col>

                </Grid>
            </TouchableOpacity>
        );


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
