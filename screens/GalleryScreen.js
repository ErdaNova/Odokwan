import { Text, View, ScrollView, StyleSheet, FlatList, TouchableHighlight, Image, Pressable, TouchableOpacity, TextInput, ImageBackground, Platform, PermissionsAndroid, } from "react-native";
import { React, useState, useRef, } from "react";
// import {Icon} from "@rneui/themed"
import { Button } from 'react-native';
import { Overlay } from '@rneui/themed';
// import Icon from 'react-native-vector-icons/Ionicons'
import { Icon } from "@rneui/themed";
import LinearGradient from 'react-native-linear-gradient';
import { useRealm } from "../App";
import { useQuery } from "../App";
import { Odok } from "../App";
import ViewShot from "react-native-view-shot";
import Share from 'react-native-share';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import {colors, regWidth, regHeight} from '../config/globalStyles';
import { OdokOverlay, } from '../components';

// type OdokData = {
//     id: Number;
//     title: String;
//     author: String;
//     read_pages: Number;
//     date: Date;
//     time: Time;
// };



const tempOdokData = [
    {
        id: 1,
        title: "Harry Potter 1",
        author: "J. K. Rowling",
        read_pages: 60,
        date: "2000-01-01",
        time: "6:00",
        minutes: 10,
        seconds: 10,
    },
    {
        id: 2,
        title: "Harry Potter 2",
        author: "J. K. Rowling",
        read_pages: 120,
        date: "2001-01-01",
        time: "12:00",
        minutes: 10,
        seconds: 10,
    },
    {
        id: 3,
        title: "Harry Potter 3",
        author: "J. K. Rowling",
        read_pages: 180,
        date: "2001-01-01",
        time: "18:00",
        minutes: 10,
        seconds: 10,
    },
    {
        id: 4,
        title: "Harry Potter 4",
        author: "J. K. Rowling",
        read_pages: 240,
        date: "2001-01-01",
        time: "24:00",
        minutes: 10,
        seconds: 10,
    },
];

// {
// title : String
// author : String
// start page : Int16Array
// end page:Int16Array
// date : AxiosHeaders
// time : string
// read_time : int


// }



const GalleryScreen = () => {

    const [visible, setVisible] = useState(false);

    const [selectedOdok, setSelectedOdok] = useState(null);
    const captureRef = useRef();

    const realm = useRealm();

    const [odoks, setOdoks] = useState(useQuery(Odok).sorted("_id",true));
      
    const toggleOverlay = (item) => {
        setSelectedOdok(item)
        setVisible(!visible);
    };

    const onShare = () => {
        captureRef.current.capture().then(async(uri) => {
            console.log("do something with ", uri);
            await Share.open({
                url: Platform.OS === 'ios' ? `file://${uri}` : uri
            })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
        }),
        (error) => console.error("Oops, snapshot failed", error);
    };

    async function hasAndroidPermission() {
        const permission = Platform.Version >= 33 ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
        
        const hasPermission = await PermissionsAndroid.check(permission);
        if (hasPermission) {
            return true;
        }
        
        const status = await PermissionsAndroid.request(permission);
        return status === 'granted';
    }

    const onSave = async() => {
        if (Platform.OS === "android" && !(await hasAndroidPermission())) {
            console.log(Platform.Version)
            return;
        }

        captureRef.current.capture().then(async(uri) => {
            console.log("do something with ", uri);
            await CameraRoll.save(
                Platform.OS === 'ios' ? `file://${uri}` : uri,
                {type: 'photo'}
            )
            .then((res) => {
                console.log("Success", res);
            })
            .catch((err) => {
                console.log(err);
            })
            }),
            (error) => console.error("Oops, snapshot failed", error);
    }
  
    const OverlayExample = () => {

        if (!selectedOdok) return null;

        const find_image = () => {
            if(selectedOdok.time<6){
                return require("./img/odokwan_600.png");
            }else if(selectedOdok.time < 12){
                return require("./img/odokwan_1200.png");
            }else if(selectedOdok.time < 18){
                return require("./img/odokwan_1800.png");
            }else{
                return require("./img/odokwan_2400.png");
            }
        };                
        
        const img_address = find_image();
        const hour = parseInt( selectedOdok.read_time / 3600);
        const minute = parseInt((selectedOdok.read_time - hour*3600) / 60);
        const second = selectedOdok.read_time % 60;

        return (
          <View>
            <Overlay 
                isVisible={visible} 
                onBackdropPress={toggleOverlay} 
                overlayStyle={{borderRadius: 10, backgroundColor: "transparent", elevation: 0}}
            >
                {/* <LinearGradient 
                    colors={["#f37880", "#f78d53", "#fa9c31"]} 
                    style={styles.overlay_linear}
                > */}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        marginHorizontal: 10,
                        marginBottom: 10,
                    }}
                >
                    <Pressable
                        onPress={() => onSave()}
                        style={{ marginHorizontal: 10, }}
                    >
                        <Icon 
                            name='download'
                            type='feather'
                            size={30}
                            color="white"
                        />
                    </Pressable>
                    <Pressable
                        onPress={() => onShare()}
                    >
                        <Icon 
                            name='share-2'
                            type='feather'
                            size={30}
                            color="white"
                        />
                    </Pressable>
                </View>
                <ViewShot
                    ref={captureRef}
                    options={{ fileName: "Your-File-Name", format: "png", quality: 0.9 }}
                >
                    <ImageBackground
                        style={styles.odokimage}
                        source={find_image()}
                        imageStyle={{borderRadius: 30}}
                    >
                        <View style={{flexDirection: 'column', height: "100%", }}>
                            <Text style={styles.overlay_title}>{selectedOdok.title}</Text>
                            <Text style={styles.overlay_author}>{selectedOdok.author}</Text>
                            <View 
                                style={{
                                    flexDirection: 'row', 
                                    position: "absolute", 
                                    bottom: 0,
                                    marginBottom: regHeight * 18,  
                                }}>
                                <View style={{paddingLeft: 20, width: 130}}>
                                    <Text style={styles.overlay_read_pages}>{selectedOdok.read_page} page</Text>
                                </View>
                                <View style={{paddingLeft: 3}}>
                                    <Text style={styles.overlay_time}>{hour}h {minute}m {second}s</Text>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </ViewShot>
                <View>
                    <Text>
                        {selectedOdok.memo}
                    </Text>
                </View>
                {/* </LinearGradient> */}
            </Overlay>
          </View>
        );
    };

    const MakeOdok = ({item, onPress, textColor}) => {

        const choose_color = () => {

            if(item.time<6){
                return ["#af7ff0", "#d8a9c2", "#f4c7a1"];
            }else if(item.time < 12){
                return ["#66d6ff", "#5ab8ff", "#51a3ff"];
            }else if(item.time < 18){
                return ["#f37880", "#f78d53", "#fa9c31"];
            }else{
                return ["#f37880", "#f78d53", "#fa9c31"];
            }

        };
        const chosen_color = choose_color();

        const hour = parseInt( item.read_time / 3600);
        const minute = parseInt((item.read_time - hour*3600) / 60);
        const second = item.read_time % 60;
        return (
        <TouchableOpacity onPress={onPress} style = {styles.odok_container} activeOpacity={0.7} >
            <LinearGradient 
                colors={chosen_color}
                style={styles.linear}    
            >
                <View style={styles.title_container}>
                    <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1}>{item.title}</Text>
                </View>
                <View style={styles.author_container}>
                    <Text style={styles.author} ellipsizeMode="tail" numberOfLines={1}>{item.author}</Text>
                </View>
                <View style={styles.bottom_container}>
                    <Text style={styles.read_pages}>{item.read_page} page</Text>
                    <Text style={styles.read_time}>{hour}h {minute}m {second}s</Text>
                    <Text style={styles.date}>{item.date}</Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
        );
    };
    
    const renderOdok = ({item}) => {
        return (
            <MakeOdok
                item={item}
                onPress={()=>toggleOverlay(item)}
                textColor={"white"}
            />
        );
    };

    return(
        <View style={{flex: 2}}>
            {/* <View>{OverlayExample()}</View> */}
            <OdokOverlay 
                selectedOdok={selectedOdok} 
                visible={visible} 
                toggleOverlay={toggleOverlay} 
            />
            <FlatList
            data={odoks}
            renderItem={renderOdok}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    odok_gallery_container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: "#FFEFDF",
    },
    title_container: {
        flex: 1,
    },
    odok_container: {
        // padding: 10,
        marginVertical: 8,
        marginHorizontal: regWidth * 16,
        backgroundColor: "white",
        height: regHeight * 100,
        borderRadius: regWidth * 10,
    },
    title: {
        color: "white",
        marginVertical: 5,
        marginLeft: regWidth * 15,
        fontSize: regWidth * 16,
        fontWeight: 'bold',
        width: "80%",
    },
    author_container: {
        flex: 1,
    },
    author: {
        color: "white",
        marginBottom: regHeight * 10,
        marginLeft: regWidth * 15,
        fontSize: regWidth * 12,
        fontWeight: 'bold',
        width: "80%",
    },
    bottom_container: {
        flex: 1,
        flexDirection: 'row',
        // justifyContent: "space-between",
    },
    read_pages: {
        color: "white",
        marginLeft: regWidth * 15,
        fontSize: regWidth * 18,
        fontWeight: 'bold',
        flex: 1,
    },
    read_time: {
        color: "white",
        marginLeft: regWidth * 15,
        fontSize: regWidth * 18,
        fontWeight: 'bold',
        flex: 1,
        paddingLeft: regWidth * 20,
    },
    date: {
        color: "white",
        fontSize: regWidth * 10,
        flex: 1,
        textAlign: "right",
        marginRight: regWidth * 10,
        marginTop: regHeight * 10,
        fontWeight: 'bold',
    },
    odokimage: {
        width: regWidth * 300,
        height: regWidth * 300,
        borderRadius: regWidth * 20,
    },
    linear: {
        flex: 1,
        borderRadius: regWidth * 10,
        flexDirection: 'column',
    },
    overlay_linear: {
        flex: 1,
        borderRadius: regWidth * 10,
        flexDirection: 'column',
    },
    overlay_title: {
        fontSize: regWidth * 20, 
        marginLeft: regWidth * 20, 
        marginTop: regWidth * 35, 
        color: "white",
    },
    overlay_author: {
        fontSize: regWidth * 12, 
        marginLeft: regWidth * 20, 
        marginTop: regHeight * 5, 
        color: "white",
    },
    overlay_read_pages: {
        fontSize: regWidth * 20, 
        // marginTop: regHeight * 260,
        color: "#696969",
        fontWeight: 'bold',
    },
    overlay_time: {
        fontSize: regWidth * 20, 
        // marginTop: regHeight * 260,
        color: "#696969",
        fontWeight: 'bold',
    },

})

export {GalleryScreen};