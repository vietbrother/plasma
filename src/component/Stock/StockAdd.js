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


export default class StockAdd extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            errorText: '',
            isLoading: false,

            textDetect: '',
            code: '',
            stateName: '',
            warehouse: '',
            createDate: new Date(),
        };
    }

    componentWillMount() {
        this.setState({textDetect: this.props.textDetect, code: this.props.textDetect});
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
                <Navbar left={left} right={right} title="Nhập thiết bị"/>
                <Content contentContainerStyle={{
                    paddingHorizontal: 10,
                    backgroundColor: '#f3f9ff'
                }}>
                    <Card transparent>
                        <CardItem header bordered>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Nhập thiết bị</Text>
                        </CardItem>
                        <CardItem>
                            <Body>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Mã nhận diện
                                : {this.state.textDetect}</Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Mã thiết bị : </Text>
                            <Input
                                placeholder={this.state.code}
                                onChangeText={(text) => this.setState({code: text})}
                                // onSubmitEditing={() => this.search(this.state.searchText)}
                                // style={{marginTop: 9}}
                            />
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Trạng thái : </Text>
                            <Picker
                                note
                                mode="dropdown"
                                style={{width: 120}}
                                selectedValue={this.state.stateName}
                                onValueChange={this.onValueChangeStateName.bind(this)}
                            >
                                <Picker.Item label={Config.stageName0KhongXacDinh} value="0"/>
                                <Picker.Item label={Config.stageName1Vo} value="1"/>
                                <Picker.Item label={Config.stageName2} value="2"/>
                                <Picker.Item label={Config.stageName3BinhTon} value="3"/>
                                <Picker.Item label={Config.stageName4BinhDangSuDung} value="4"/>
                            </Picker>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Kho : </Text>
                            <Picker
                                note
                                mode="dropdown"
                                style={{width: 120}}
                                selectedValue={this.state.warehouse}
                                onValueChange={this.onValueChangeWarehouse.bind(this)}
                            >
                                <Picker.Item label="Không xác định" value="0"/>
                                <Picker.Item label="Kho công ty" value="1"/>
                                <Picker.Item label="Kho nhà máy" value="2"/>
                                <Picker.Item label="Kho khách hàng" value="3"/>
                            </Picker>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                            <Text style={{}}>Ngày nhập : </Text>
                            <DatePicker
                                defaultDate={this.state.createDate}
                                // minimumDate={new Date(2018, 1, 1)}
                                // maximumDate={new Date(2018, 12, 31)}
                                locale={"en"}
                                timeZoneOffsetInMinutes={undefined}
                                modalTransparent={false}
                                animationType={"fade"}
                                androidMode={"default"}
                                placeHolderText="Chọn ngày"
                                textStyle={{color: "green"}}
                                placeHolderTextStyle={{color: "#d3d3d3"}}
                                onDateChange={this.setDate}
                                disabled={false}
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
                                <Button bordered onPress={() => this.addDevice()}>
                                    <Text style={{color: '#fdfdfd'}}> {Config.btnAddDevice} </Text>
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
                                    <Text><Icon name='ios-arrow-back'/> Hủy</Text>
                                </Button>
                            </Right>
                        </CardItem>

                        {/*<View style={{alignItems: 'center', width: '100%'}}>*/}
                            {/*<Button bordered onPress={() => this.login()}>*/}
                                {/*<Text style={{color: '#fdfdfd'}}> {Config.btnAddDevice} </Text>*/}
                            {/*</Button>*/}

                        {/*</View>*/}
                    </Card>

                </Content>

            </Container>
        );
    }


    async addDevice() {

        var stateName = this.state.stateName;
        var warehouse = this.state.warehouse;
        if (stateName == null || stateName == '') {
            this.setState({hasError: true, errorText: 'Cần nhập trạng thái'});
            return;
        }
        if (warehouse == null || warehouse == '') {
            this.setState({hasError: true, errorText: 'Cần nhập kho'});
            return;
        }
        try {
            this.setState({isLoading: true});

            console.log(statusLogin);
        } catch (error) {
            this.setState({isLoading: false});
            console.error(error);
        }
        //
        // if (statusLogin == 'ok') {
        //     Actions.home({sessionLoginKey: sessionLoginKey});
        // } else {
        //     this.setState({hasError: true, errorText: 'Tên đăng nhập hoặc mật khẩu không đúng'});
        // }

        Actions.pop();
    }


}

const styles = {
    spinnerTextStyle: {
        color: '#FFF',
        fontWeight: 'bold'
    },
};
