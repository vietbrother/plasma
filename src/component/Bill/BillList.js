/**
 * This is the Main file
 **/

// React native and others libraries imports
import React, {Component} from 'react';
import {Alert, AsyncStorage, FlatList} from 'react-native';
import {
    Container,
    Content,
    View,
    Header,
    Icon,
    Button,
    Left,
    Right,
    Body,
    Title,
    List,
    ListItem,
    Thumbnail,
    Grid,
    Col, CardItem, Card
} from 'native-base';
import {Actions} from 'react-native-router-flux';

// Our custom files and classes import
import Colors from '../../Colors';
import Config from '../../Config';
import Text from '../../component/Text';
import Navbar from '../../component/Navbar';

export default class BillList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cartItems: [],
            total: 0,
            userId: ''
        };
    }

    componentDidMount() {
        // this.setState({cartItems: this.props.lstDevice == null ? [] : JSON.parse(this.props.lstDevice)});
        AsyncStorage.getItem('LIST_DEVICE_IN_OUT', (err, res) => {
            console.log("res " + res);
            if (res) {
                var itemArr = JSON.parse(res);
                // var temp = itemArr.filter(function (cartItem) {
                //     return cartItem.userId == userId;
                // });
                this.setState({cartItems: itemArr});
            }
        });

    }

    render() {
        var left = (
            <Left style={{flex: 1}}>
                <Button transparent onPress={() => Actions.pop()}>
                    <Icon name="ios-close" size={38} style={{fontSize: 38}}/>
                </Button>
            </Left>
        );
        return (
            <Container style={{backgroundColor: '#fdfdfd'}}>
                <Navbar left={left} title={Config.orderListDevice}/>
                {this.state.cartItems.length <= 0 ?
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Icon name="ios-paper" size={38} style={{fontSize: 38, color: '#95a5a6', marginBottom: 7}}/>
                        <Text style={{color: '#95a5a6'}}>{Config.deviceListEmpty}</Text>
                    </View>
                    :
                    <Content style={{paddingRight: 10}}>
                        <List>
                            {this.renderItems()}
                        </List>
                        <Grid style={{marginTop: 20, marginBottom: 10}}>
                            <Col style={{paddingLeft: 10, paddingRight: 5}}>
                                <Button onPress={() => Actions.pop()}
                                        style={{backgroundColor: Config.mainColor}} block iconLeft>
                                    <Icon name='ios-card'/>
                                    <Text style={{color: 'white'}}> Đóng </Text>
                                </Button>
                            </Col>
                            {/*<Col style={{paddingLeft: 5, paddingRight: 10}}>*/}
                                {/*<Button onPress={() => this.removeAllPressed()}*/}
                                        {/*style={{borderWidth: 1, borderColor: Colors.navbarBackgroundColor}} block*/}
                                        {/*iconRight transparent>*/}
                                    {/*<Text style={{color: Colors.navbarBackgroundColor}}> Xóa hết </Text>*/}
                                    {/*<Icon style={{color: Colors.navbarBackgroundColor}} name='ios-trash-outline'/>*/}
                                {/*</Button>*/}
                            {/*</Col>*/}
                        </Grid>
                    </Content>
                }
            </Container>
        );
    }

    renderItems() {
        let items = [];
        this.state.cartItems.map((item, i) => {
            items.push(
                <ListItem
                    key={i}
                    last={this.state.cartItems.length === i + 1}
                    // onPress={() => this.itemClicked(item)}
                >
                    <Body style={{paddingLeft: 10}}>
                    <Text style={{fontSize: 16, color: Config.mainColor}}>
                        {item}
                    </Text>
                    </Body>
                    {/*<Right>*/}
                        {/*<Button style={{marginLeft: -25}} transparent onPress={() => this.removeItemPressed(item)}>*/}
                            {/*<Icon size={30} style={{fontSize: 30, color: 'red'}}*/}
                                  {/*name='ios-remove-circle-outline'/>*/}
                        {/*</Button>*/}
                    {/*</Right>*/}

                </ListItem>
            );
        });
        return items;
    }

    removeItemPressed(item) {
        Alert.alert(
            'Xóa ' + item.code,
            'Bạn có muốn xóa thiết bị ' + item.code + '  trong đơn hàng ?',
            [
                {text: 'Không', onPress: () => console.log('No Pressed'), style: 'cancel'},
                {text: 'Có', onPress: () => this.removeItem(item)},
            ]
        )
    }

    removeItem(itemToRemove) {
        let items = [];
        this.state.cartItems.map((item) => {
            if (JSON.stringify(item) !== JSON.stringify(itemToRemove))
                items.push(item);
        });
        this.setState({cartItems: items});
        AsyncStorage.setItem(Config.keyStoreOrderDeviceOut, JSON.stringify(items));
    }

    removeAllPressed() {
        Alert.alert(
            'Xóa thiết bị',
            'Bạn có muốn xóa hết thiết bị trong đơn ?',
            [
                {text: 'Không', onPress: () => console.log('No Pressed'), style: 'cancel'},
                {text: 'Có', onPress: () => this.removeAll()}
            ]
        )
    }

    removeAll() {
        this.setState({cartItems: []})
        AsyncStorage.setItem(Config.keyStoreOrderDeviceOut, JSON.stringify([]));
    }


    itemClicked(item) {
        Actions.deviceDetail({device: item})
    }

}

const styles = {
    title: {
        fontFamily: 'Roboto',
        fontWeight: '100'
    }
};

// const items = [
//     {
//         id: 1,
//         quantity: 1,
//         title: 'Black Hat',
//         categoryId: 5,
//         categoryTitle: 'MEN',
//         price: '22$',
//         image: 'http://res.cloudinary.com/atf19/image/upload/c_crop,h_250,w_358,x_150/v1500465309/pexels-photo-206470_nwtgor.jpg',
//         description: "Hello there, i'm a cool product with a heart of gold."
//     },
//     {
//         id: 2,
//         quantity: 3,
//         title: 'V Neck T-Shirt',
//         categoryId: 2,
//         categoryTitle: 'WOMEN',
//         price: '12$',
//         image: 'http://res.cloudinary.com/atf19/image/upload/c_crop,h_250,x_226,y_54/v1500465309/pexels-photo-521197_hg8kak.jpg',
//         description: "Hello there, i'm a cool product with a heart of gold."
//     },
//     {
//         id: 10,
//         quantity: 1,
//         title: 'Black Leather Hat',
//         categoryId: 1,
//         categoryTitle: 'KIDS',
//         price: '2$',
//         image: 'http://res.cloudinary.com/atf19/image/upload/c_crop,g_face,h_250,x_248/v1500465308/fashion-men-s-individuality-black-and-white-157675_wnctss.jpg',
//         description: "Hello there, i'm a cool product with a heart of gold."
//     },
// ];
