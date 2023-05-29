import React, { Component, useState } from 'react';
import { View, PermissionsAndroid, Platform, StyleSheet, Button, TouchableOpacity, TouchableHighlight } from 'react-native';
import { CameraScreen} from 'react-native-camera-kit';
//import * as React from 'react';
import 'react-native-gesture-handler';
import { Text , Image} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import { Alert } from 'native-base';
// import CameraScreen from 'react-native-camera-kit';
import axios from 'axios';

var parseString = require('react-native-xml2js').parseString;


const ScanBarcodeScreen = ({navigation}) => {
    const [codeval, setCodeval] = useState('');
    const [openScan, setOpenScan] = useState(false);
    const [bookInfo, setBookInfo] = useState({})
    const [bookSearched, setBookSearched] = useState(false);

    
    

    const searchBook = async (input) => {
      try {
        const response = await axios.get(
          "https://openapi.naver.com/v1/search/book_adv.xml",
          {params:{d_isbn : input},
          headers :{
              "X-Naver-Client-Id" : "cxxfk1HU9t3_bFTabFza",
              "X-Naver-Client-Secret" : "zeJoQHiNTp"
          }
        }
        );

        parseString(response.data, function (err, result) {
          console.dir(result);
          var res = JSON.parse(JSON.stringify(result)).rss.channel[0].item[0];
          setBookInfo({title: res.title[0], author : res.author[0], image : res.image[0]})
          setBookSearched(true);
          console.log({title: res.title[0], author : res.author[0], image : res.image[0]})
      });
      } catch (e) {
        console.log("failed");
      }
    };

    const onBarcodeScan = (codeval) => {
      setCodeval(codeval);
      setOpenScan(false);
      searchBook(codeval);
  };
    
    const onOpenScan = () => {
        if (Platform.OS === 'android') {
            // Asking for Camera permission
            async function requestCameraPermission() {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.CAMERA,
                        {
                            title: "Permission for Camera",
                            message: "Permission for Camera Required",
                        },
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        setCodeval('');
                        setOpenScan(true);
                    } else {
                        Alert("Permission Denied");
                    }
                } catch (err) {
                    Alert('Camera error', err);
                    console.warn(err);
                }
            }
            requestCameraPermission();
        } else {
            setCodeval('');
            setOpenScan(true);
        }
    };
    


    return(
        <View style={{flex: 1}}>
        {openScan ? (
            <View style={{flex: 1}}>
                <CameraScreen
                showFrame={true}
                scanBarcode={true}
                laserColor={'#e32f45'}
                frameColor={'#e32f45'}
                colorForScannerFrame={'black'}
                onReadCode={(event) =>
                    onBarcodeScan(event.nativeEvent.codeStringValue)
                }
            />
            </View>
        ) : (
        <View style={styles.container}>
          <View style={{flex: 2}}/>
          <View>

            {bookSearched ? 
            (<View style = {{alignItems:"center", justifyContent:"center"}}>
                <View
                  style={{
                      height: 250,
                      width: 200,
                      backgroundColor: "white",
                      justifyContent: "center",
                      alignItems: "center",
                      marginVertical: 30,
                  }}
              >
                  <Image 
                          source={{uri : bookInfo.image}}
                          style={{width:"100%", height:"100%"}}
                      />
                  <Text style = {{ width : "80%"}}>{bookInfo.title}</Text>
                  <Text>{bookInfo.author}</Text>
                  {/* <Text style={{ fontSize: 20, color: "black" }}>
                      Book Cover
                  </Text> */}

              </View>

              </View>)
            :
              <></>

            }
            
            
        
          </View>
          <View style={{flex: 1}}>
            <View style={styles.btnArea}>
              <TouchableOpacity style={styles.btn} onPress={onOpenScan}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 17,
                  }}>
                  Scan Barcode
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 2}}>
            <Text>
                here is barcode scan pagess
            </Text>
            <Button
            title="go to book info"
            onPress={() => navigation.navigate("BookInfo",
            {
              title: bookInfo.title, 
              author: bookInfo.author, 
              page_number: 0, 
              image: bookInfo.image,
            })}
            />
        </View>
        </View>
        )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'white',
    },
    btnArea: {
      height: hp(8),
      //backgroundColor: 'orange',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: hp(1.5),
      paddingBottom: hp(1.5),
    },
    btn: {
      flex: 1,
      width: wp(50),
      borderRadius: 7,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#e32f45',
    },
  });


export {ScanBarcodeScreen};