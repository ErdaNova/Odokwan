import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { Icon, BottomSheet, ListItem } from "@rneui/themed";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {HomeScreen} from "./screens/HomeScreen"
import { BooklistScreen } from "./screens/BooklistScreen";
import { GalleryScreen } from "./screens/GalleryScreen";
import { AnalyticsScreen } from "./screens/AnalyticsScreen";
import { BookDetailScreen } from "./screens/BookDetailScreen";
import { OdokTimerScreen, OdokCreateScreen } from "./screens/OdokTimerScreen";

import { ScanBarcodeScreen } from "./screens/ScanBarcodeScreen";
import { SearchBookScreen } from "./screens/SearchBookScreen";
import { BookInfoScreen } from "./screens/BookInfoScreen";
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { Button } from 'react-native';
import * as RootNavigation from "./RootNavigation"
import { createRealmContext, RealmConfiguration, Builder } from '@realm/react';







const Tab = createBottomTabNavigator();

const stackHome = createStackNavigator();
const stackBooklist = createStackNavigator();

function HomeStack({navigation, route}) {
    React.useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (routeName ==="HomeScreen" || routeName === undefined){
            navigation.setOptions({ tabBarStyle : {display: 'flex' , position: "absolute",
            bottom: 25,
            left:20,
            right:20,
            elevation:0,
            backgroundColor:"#ffffff",
            borderRadius:15,
            height:90,
            ...styles.shadow}});
    }
        else {
            navigation.setOptions({ tabBarStyle : {display: 'none' }, });
        }
    }, [navigation, route]);
    return(
        <stackHome.Navigator initialRouteName="HomeScreen" >
            <stackHome.Screen name="HomeScreen" component={HomeScreen} options={{title:"ODOK"}}/>
            <stackHome.Screen name="BookDetail" component={BookDetailScreen} options={{title:"Book Detail"}}/>
            <stackHome.Screen name="OdokTimer" component={OdokTimerScreen} options={{title:"ODOK"}}/>
            <stackHome.Screen 
                name="OdokCreate" 
                component={OdokCreateScreen} 
                options={{
                    presentation: "transparentModal",
                    headerShown: false,
                    cardOverlayEnabled: true
                }}
            />
            <stackHome.Screen name="SearchBook" component={SearchBookScreen} options={{title:"ODOK"}}/>
            <stackHome.Screen name="ScanBarcode" component={ScanBarcodeScreen} options={{title:"ODOK"}}/>
            <stackHome.Screen name="BookInfo" component={BookInfoScreen} options={{title:"ODOK"}}/>
        </stackHome.Navigator>
    )
}






const Tabs = () => {

    const [isVisible, setIsVisible] = useState(false);
    const list = [
    { title: 'search with book name' , onPress: () => {setIsVisible(false); RootNavigation.navigate("SearchBook")}},
    { title: 'search with book barcode', onPress: () => {setIsVisible(false); RootNavigation.navigate("ScanBarcode")} },
    { title: 'type book information directly', onPress: () => {setIsVisible(false); RootNavigation.navigate("BookInfo", 
    {
        title: "", 
        author: "", 
        page_number: 0, 
        image: "",
    })}},
    ];


    return(

            <SafeAreaProvider>
                {/* this is the bottom tab of app */}
                <Tab.Navigator
                    screenOptions={{
                        tabBarShowLabel:false,
                        bottom:25,
                        tabBarStyle:{
                            position: "absolute",
                            bottom: 25,
                            left:20,
                            right:20,
                            elevation:0,
                            backgroundColor:"#ffffff",
                            borderRadius:15,
                            height:90,
                            ...styles.shadow
                        }
                    }} >
                    <Tab.Screen name = "Home" component={HomeStack} options={{title:"ODOK",
                        headerShown:false,
                        tabBarIcon: ({focused}) =>(
                            <View style ={{alignItems:"center", justifyContent:"center", bottom: 3}} >
                                <Icon name='home' 
                                color = {focused ? "#e32f45" : "#748c94"}
                                iconProps={{
                                    size:30
                                    }}  />
                                <Text style={{ color: focused ? "#e32f45" : "#748c94", fontSize:12, top:5}} >
                                    Home
                                </Text>
                            </View>
                    )}}/>
                    <Tab.Screen name = "Booklist" component={BooklistScreen} options={{title:"ODOK",
                        tabBarIcon: ({focused}) =>(
                            <View style ={{alignItems:"center", justifyContent:"center", bottom: 3}} >
                                <Icon name='library-books' 
                                color = {focused ? "#e32f45" : "#748c94"}
                                iconProps={{
                                    size:30
                                    }}  />
                                <Text style={{ color: focused ? "#e32f45" : "#748c94", fontSize:12, top:5}} >
                                    Booklist
                                </Text>
                            </View>
                    )}}/>




                    {/* this is the center button */}
                    <Tab.Screen name = "CreateBook" component={HomeScreen}
                        listeners={({navigation}) => ({
                            tabPress: (e) => {
                                e.preventDefault();
                            }
                        })}
                        options={{title:"ODOK",
                        tabBarIcon: ({focused}) =>(
                                <Icon name='add' 
                                color = "#ffffff"
                                iconProps={{
                                    size:50
                                    }}  />
                        ), tabBarButton : (props) => (
                            <TouchableOpacity
                                style = {{
                                    top:-30,
                                    justifyContent:"center",
                                    alignContent:"center",
                                    ...styles.shadow
                                }}
                                onPress={() => setIsVisible(true)}
                                >
                                    <View style={{
                                        width:70,
                                        height:70,
                                        borderRadius:35,
                                        backgroundColor: "#e32f45",
                                        alignContent:"center",
                                        justifyContent:"center"
                                    }}>
                                        <Icon name='add' 
                                            color = "#ffffff"
                                            iconProps={{
                                                size:50
                                                }}  />
                                    </View>
                            </TouchableOpacity>
                        )
                    }}
                    
                    />

                    <Tab.Screen name = "Gallery" component={GalleryScreen} options={{title:"ODOK",
                        tabBarIcon: ({focused}) =>(
                            <View style ={{alignItems:"center", justifyContent:"center", bottom: 3}} >
                                <Icon name='photo' 
                                color = {focused ? "#e32f45" : "#748c94"}
                                iconProps={{
                                    size:30
                                    }}  />
                                <Text style={{ color: focused ? "#e32f45" : "#748c94", fontSize:12, top:5}} >
                                    Gallery
                                </Text>
                            </View>
                    )}}/>
                    <Tab.Screen name = "Analytics" component={AnalyticsScreen} options={{title:"ODOK",
                        tabBarIcon: ({focused}) =>(
                            <View style ={{alignItems:"center", justifyContent:"center", bottom: 3}} >
                                <Icon name='bar-chart' 
                                color = {focused ? "#e32f45" : "#748c94"}
                                iconProps={{
                                    size:30
                                    }}  />
                                <Text style={{ color: focused ? "#e32f45" : "#748c94", fontSize:12, top:5}} >
                                    Analytics
                                </Text>
                            </View>
                    )}}/>
                </Tab.Navigator>

                {/* this is the bottom sheet of app */}
                <BottomSheet modalProps={{}} isVisible={isVisible} onBackdropPress={()=> setIsVisible(false)}>
                    {list.map((l, i) => (
                    <ListItem
                        key={i}
                        containerStyle={l.containerStyle}
                        onPress={l.onPress}
                    >
                        <ListItem.Content>
                        <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                    ))}
                </BottomSheet>
            </SafeAreaProvider>


    );
}

const styles = StyleSheet.create({
    shadow : {
        shadowColor:"#7f5df0",
        shadowOffset:{
            width:0,
            height:10,
        },
        shadowOpacity:0.25,
        shadowRadius:3.5,
        elevation:5
        }
    }
);

export default Tabs;