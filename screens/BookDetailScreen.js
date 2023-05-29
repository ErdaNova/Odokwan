import * as React from 'react';
import { Button, View, FlatList, TouchableOpacity } from 'react-native';
import 'react-native-gesture-handler';
import { Text, Image, StyleSheet, ImageBackground } from 'react-native';
import { Book, useObject, useRealm } from '../App';
import LinearGradient from 'react-native-linear-gradient';
import { useState } from "react";
import { Overlay } from '@rneui/themed';



const BookDetailScreen = ({navigation, route}) => {
    const realm = useRealm();
    const odoks = realm.objects("Odok");
    const bookTitle = route.params.title;
    const importantOdoks = odoks.filtered("title == $0", bookTitle);
    const [visible, setVisible] = useState(false);

    const [selectedOdok, setSelectedOdok] = useState(null);


    const renderOdok = ({item}) => {
        return (
            <MakeOdok
                item={item}
                onPress={()=>toggleOverlay(item)}
                textColor={"white"}
            />
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
                    <Text style={styles.odok_title}>{item.title}</Text>
                </View>
                <View style={styles.author_container}>
                    <Text style={styles.odok_author}>{item.author}</Text>
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

    const toggleOverlay = (item) => {
        setSelectedOdok(item)
        setVisible(!visible);
    };
  
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
                    <ImageBackground
                        style={styles.odokimage}
                        source={find_image()}
                        imageStyle={{borderRadius: 30}}
                    >
                    <View style={{flexDirection: 'column'}}>
                        <Text style={styles.overlay_title}>{selectedOdok.title}</Text>
                        <Text style={styles.overlay_author}>{selectedOdok.author}</Text>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{paddingLeft: 20, width: 130}}>
                            <Text style={styles.overlay_read_pages}>{selectedOdok.read_page} page</Text>
                            </View>
                            <View style={{paddingLeft: 3}}>
                            <Text style={styles.overlay_time}>{hour}h {minute}m {second}s</Text>
                            </View>
                        </View>
                    </View>
                    </ImageBackground>
                {/* </LinearGradient> */}
            </Overlay>
          </View>
        );
      };

    return(
        <View style={styles.container}>
            <View>{OverlayExample()}</View>
            <View style={styles.detailcontainer}>
                <View style={{flex: 1}}>
                    <Image 
                        source={{uri : route.params.image}}
                        style={styles.bookimage}
                    />
                </View>
                <View style={styles.textcontainer}>
                    <View style={{marginLeft: 10, marginTop: 5}}>{status_icon(route.params.status)}</View>
                    <Text style={styles.title}>
                        {route.params.title}
                        {/* title */}
                    </Text>
                    <Text style={styles.author}>
                        {route.params.author}
                        {/* author */}
                    </Text>
                    <Text style={styles.page_number}>
                        Total {route.params.page}p
                        {/* Total 123p */}
                    </Text>
                </View>
            </View>
            {/* <View 
                style={{
                    borderColor: "black",
                    borderWidth: 0.5,
                    marginBottom: 30,
                    marginHorizontal: 30,
                }}
            /> */}
            <View style={styles.odokcontainer}>
                <Button
                    title="start odok"
                    onPress={() => {navigation.navigate("OdokTimer", {
                        title: route.params.title, 
                        image: route.params.image,
                        page: route.params.page,
                        author:route.params.author,
                        readPage : route.params.readPage,
                        id : route.params.id
                    }); console.log(importantOdoks)}}
                />
                <View style={{flex: 2}}>
                    {/* <View>{OverlayExample()}</View> */}
                        <FlatList
                        data={importantOdoks}
                        renderItem={renderOdok}
                        />
                </View>
            </View>
        </View>
    );
}
const status_icon = (status) => {
    const color = status === 0 ? "blue" : "orange";
    const status_text = status === 0 ? "reading" : "done";
    return (
        <View style={[styles.status_icon, {borderColor: color}]}>
            <Text style={{color: color, fontSize: 12, textAlign: "center"}}>{status_text}</Text>
        </View>
    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    detailcontainer: {
        flexDirection: 'row',
        height:200
    },
    textcontainer: {
        flexDirection: "column",
        flex: 1.3,
    },
    odokcontainer: {
        flex: 1.5,
    },
    title: {
        color: "black",
        marginVertical: 10,
        marginRight: 15,
        fontSize: 15,
    },
    author: {
        color: "black",
        marginVertical: 10,
        fontSize: 12,
    },
    page_number: {
        color: "black",
        marginVertical: 10,
        fontSize: 14,
    },
    bookimage: {
        width: 100,
        height: 160,
        marginLeft: 30,
    },
    status_icon: {
        width: 50,
        height: 25,
        borderRadius: 5,
        justifyContent: "center",
        borderWidth: 1,
    },
    odok_gallery_container: {
        flex: 1,
        flexDirection: 'column',
    },
    title_container: {
        flex: 1,
    },
    odok_container: {
        // padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: "white",
        height: 100,
        borderRadius: 10,
    },
    odok_title: {
        color: "white",
        marginVertical: 5,
        marginLeft: 15,
        fontSize: 16,
        fontWeight: 'bold',
    },
    author_container: {
        flex: 1,
    },
    odok_author: {
        color: "white",
        marginBottom: 10,
        marginLeft: 15,
        fontSize: 12,
        fontWeight: 'bold',
    },
    bottom_container: {
        flex: 1,
        flexDirection: 'row',
        // justifyContent: "space-between",
    },
    read_pages: {
        color: "white",
        marginLeft: 15,
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    read_time: {
        color: "white",
        marginLeft: 15,
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        paddingLeft: 20,
    },
    date: {
        color: "white",
        fontSize: 10,
        flex: 1,
        textAlign: "right",
        marginRight: 10,
        marginTop: 10,
        fontWeight: 'bold',
    },
    odokimage: {
        width: 300,
        height: 300,
        borderRadius: 20,
    },
    linear: {
        flex: 1,
        borderRadius: 10,
        flexDirection: 'column',
    },
    overlay_linear: {
        flex: 1,
        borderRadius: 10,
        flexDirection: 'column',
    },
    overlay_title: {
        fontSize: 20, 
        marginLeft: 20, 
        marginTop: 35, 
        color: "white",
    },
    overlay_author: {
        fontSize: 12, 
        marginLeft: 20, 
        marginTop: 5, 
        color: "white",
    },
    overlay_read_pages: {
        fontSize: 20, 
        marginTop: 175,
        color: "#696969",
        fontWeight: 'bold',
    },
    overlay_time: {
        fontSize: 20, 
        marginTop: 175, 
        color: "#696969",
        fontWeight: 'bold',
    },
})



export {BookDetailScreen};