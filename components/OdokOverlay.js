import { Text, View, ScrollView, StyleSheet, FlatList, TouchableHighlight, Image, Pressable, TouchableOpacity, TextInput, ImageBackground, Platform, PermissionsAndroid, Alert, } from "react-native";
import { React, useState, useRef, useEffect, } from "react";
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

const OdokOverlay = (props) => {
    const selectedOdok = props.selectedOdok;
    const visible = props.visible;
    const toggleOverlay = props.toggleOverlay;
    const captureRef = useRef();


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
                Alert.alert("Download successful!")
            })
            .catch((err) => {
                console.log(err);
            })
            }),
            (error) => console.error("Oops, snapshot failed", error);
    }

    if (!selectedOdok) return null;

    const find_image = () => {
        if(selectedOdok.time<6){
            return require("../screens/img/odokwan_600.png");
        }else if(selectedOdok.time < 12){
            return require("../screens/img/odokwan_1200.png");
        }else if(selectedOdok.time < 18){
            return require("../screens/img/odokwan_1800.png");
        }else{
            return require("../screens/img/odokwan_2400.png");
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
            <View
                style={{
                    backgroundColor: "white",
                    marginTop: -regHeight * 40,
                    paddingTop: regHeight * 40,
                    marginHorizontal: regWidth * 4,
                    paddingHorizontal: regWidth * 8,
                    zIndex: -1,
                    borderRadius: regWidth * 10,
                }}
            >
                <Text style={{ color: "black", fontSize: regWidth * 14, }}>
                    {selectedOdok.memo}
                </Text>
            </View>
            {/* </LinearGradient> */}
        </Overlay>
      </View>
    );
};

export default OdokOverlay;


const styles = StyleSheet.create({
    odokimage: {
        width: regWidth * 300,
        height: regWidth * 300,
        borderRadius: regWidth * 20,
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