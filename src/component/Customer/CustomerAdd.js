/**
 * This is the Main file
 **/

// React native and others libraries imports
import React, {Component} from 'react';
import {Image, Dimensions, TouchableWithoutFeedback, AsyncStorage} from 'react-native';
import {
    View,
    Container,
    Content,
    Button,
    Left,
    Right,
    Icon,
    Picker,
    Item,
    Grid,
    Col,
    Toast,
    Text as NBText,
    List, ListItem,
    Card, CardItem,
    DatePicker,
    Body, Input
} from 'native-base';
import {Actions} from 'react-native-router-flux';
import Carousel, {Pagination} from 'react-native-snap-carousel';

// Our custom files and classes import
import Config from '../../Config';
import Text from '../../component/Text';
import Navbar from '../../component/Navbar';
import Spinner from 'react-native-loading-spinner-overlay';


export default class CustomerAdd extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            errorText: '',
            isLoading: false,

            name: '',
            address: '',
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
        /* Select the default color and size (first ones) */
        // let defColor = this.state.order.colors[0];
        // let defSize = this.state.order.sizes[0];
        // this.setState({
        //     selectedColor: defColor,
        //     selectedSize: defSize
        // });
    }

    onValueChangeStateName(value: string) {
        this.setState({
            stateName: value
        });
    }

    onValueChangeWarehouse(value: string) {
        this.setState({
            warehouse: value
        });
    }

    setDate(newDate) {
        this.setState({createDate: newDate});
    }

    render() {
        var left = (
            <Left style={{flex: 1}}>
                <Button onPress={() => Actions.pop()} transparent>
                    <Icon name='ios-arrow-back'/>
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
            <Container style={{backgroundColor: '#fdfdfd'}}>
                <Spinner
                    //visibility of Overlay Loading Spinner
                    visible={this.state.isLoading}
                    //Text with the Spinner
                    //textContent={'Đang đăng nhập ...'}
                    //Text style of the Spinner Text
                    textStyle={styles.spinnerTextStyle}
                />
                <Navbar left={left} right={right} title={Config.customerAddTitle}/>
                <Content contentContainerStyle={{
                    paddingHorizontal: 10,
                    backgroundColor: '#f3f9ff'
                }}>
                    <Card transparent>
                        <CardItem header bordered>
                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>{Config.customerAddTitle}</Text>
                        </CardItem>

                        <CardItem>
                            <Body>
                            <Text style={styles.title}>{Config.customerName} : </Text>
                            <Input
                                placeholder={'Nhập ' + Config.customerName}
                                onChangeText={(text) => this.setState({name: text})}
                            />
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                            <Text style={styles.title}>{Config.customerAddress} : </Text>
                            <Input
                                placeholder={'Nhập ' + Config.customerAddress}
                                onChangeText={(text) => this.setState({address: text})}
                            />
                            </Body>
                        </CardItem>


                        {this.state.hasError ? <Text style={{
                            color: Config.errorColor,
                            textAlign: 'center',
                            marginTop: 10
                        }}>{this.state.errorText}</Text> : null}

                        <CardItem>
                            <Left>
                                <Button bordered onPress={() => this.add()}>
                                    <Text style={{color: '#fdfdfd'}}> {Config.customerAddTitle} </Text>
                                </Button>
                            </Left>
                            <Body>
                            {/*<Button transparent>*/}
                            {/*<Icon active name="chatbubbles"/>*/}
                            {/*<Text>4 Comments</Text>*/}
                            {/*</Button>*/}
                            </Body>
                            <Right>
                                <Button onPress={() => Actions.pop()} transparent>
                                    <Text><Icon name='ios-arrow-back'/> {Config.btnCancel}</Text>
                                </Button>
                            </Right>
                        </CardItem>

                    </Card>

                </Content>

            </Container>
        );
    }


    async add() {

        var name = this.state.name;
        var address = this.state.address;
        if (name == null || name == '') {
            this.setState({hasError: true, errorText: Config.required + Config.customerName});
            return;
        }
        if (address == null || address == '') {
            this.setState({hasError: true, errorText: Config.required + Config.address});
            return;
        }

        try {
            this.setState({isLoading: true});

            console.log(statusLogin);
            Actions.pop();
        } catch (error) {
            this.setState({isLoading: false});
            console.error(error);
        }
    }

    _createCustomer() {
        try {
            // Connect to Odoo
            global.odooAPI.connect(function (err) {
                if (err) {
                    console.log('--------------connect error');
                    alert(Config.err_connect)
                    this.setState({isLoading: false});
                    return console.log(err);
                }
            });
            var params = {
                name: this.state.name,
                address: this.state.address,
            }; //params
            global.odooAPI.create('p.customer', params, this._getResCreateCustomer.bind(this)); //update stage

        } catch (e) {
            console.log(e);
            Alert.alert(
                '',
                Config.err_add, // <- this part is optional, you can pass an empty string
                [
                    {text: Config.btnClose, onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false},
            );
            this.setState({isLoading: false});
        }
    }

    _getResCreateCustomer(err, response) {
        if (err) {
            alert(err);
            return console.log(err);
        }
        console.log('_______response__create__customer_______________');
        console.log(response);
        try {
            this.setState({isLoading: false});
            if (response) {
                alert(Config.success);
                Actions.pop();
            } else {
                alert('Chuyển trạng thái mã bình ' + this.state.textDetect + ' thất bại ');
            }
        } catch (e) {
            console.log(e);
            this.setState({isLoading: false});
        }
    }

}

const styles = {
    spinnerTextStyle: {
        color: '#FFF',
        fontWeight: 'bold'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    }
};
