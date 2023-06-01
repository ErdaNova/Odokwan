import React, { useState, useRef, useEffect, } from 'react';
import { Button, View, StyleSheet, Image, Pressable, ScrollView, RefreshControl, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import { BookDetailScreen } from './BookDetailScreen';
import { Text } from 'react-native';
import * as RootNavigation from "../RootNavigation"
import { useRealm } from "../App";
import { useQuery } from "../App";
import { Odok } from "../App";
import {colors, regWidth, regHeight} from '../config/globalStyles';
// import { ScrollView } from 'react-native-gesture-handler';


const HomeScreen = ({navigation}) => {
    const realm = useRealm();
    const [books, setBooks] = useState(realm.objects("Book"));
    // const books = realm.objects("Book");
    const [recentOdok, setRecentOdok] = useState(useQuery(Odok).sorted("_id",true)[0]);
<<<<<<< HEAD
    const bookTitle = (recentOdok ? recentOdok.title : "");
=======
    const bookId = (recentOdok ? recentOdok.book_id : '');
>>>>>>> JS
    const [recentBook, setRecentBook] = useState(null);
    // const recentBook = books.filtered("title == $0", bookTitle)[0];
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchRecentBook();
    }, []);

    const fetchRecentBook = () => {
        setRecentBook(books.filtered("_id == $0", bookId)[0]);
    }

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = async() => {
        setRefreshing(true);
        
        wait(1000)
        .then(() => setRefreshing(false));
    };

    return(
        <View style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    />
                }
            >
            <View
                // onPress={()=>{navigation.navigate("BookDetail", 
                // {
                //     title: recentBook.title, 
                //     author: recentBook.author, 
                //     page: recentBook.page, 
                //     image: recentBook.image,
                //     status: recentBook.status,
                //     readPage : recentBook.readPage,
                //     id : recentBook._id
                // })}}
                style={styles.recentBookContainter}
            >
                <Text
                    style={{
                        fontSize: regWidth * 18,
                        color: "black",
                        marginBottom: regHeight * 8,
                    }}
                >
                    Recently Read
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", }}>
                    {recentBook ? 
                        <>
                            <Image 
                                source={{uri : recentBook.image}}
                                style={styles.bookimage}
                            />
                            <View
                                style={{ width: "50%"}}
                            >
                                <Text style={styles.titleTxt}>
                                    {recentBook.title}
                                </Text>
                                <Text style={styles.authorTxt}>
                                    {recentBook.author}
                                </Text>
                            </View>
                        </>
                    : 
                        null
                    }

                </View>

            </View>
            <Button
                title="start odok"
                onPress={() => {
                    navigation.navigate("OdokTimer", {
                        // title: route.params.title, 
                        // image: route.params.image,
                        // page: route.params.page,
                        // author:route.params.author,
                        // readPage : route.params.readPage,
                        // id : route.params.id
                        book: recentBook
                    }); 
                }}
            />
        {/* <Button
            title="book list"
            onPress={() => navigation.navigate("Booklist")} 
        /> */}
        {/* <Button
            title="book detail"
            onPress={() => RootNavigation.navigate("BookDetail")}
            
        /> */}
        </ScrollView>
        </View>
    );
}

export {HomeScreen};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    recentBookContainter: {
        paddingHorizontal: regWidth * 12,
        marginTop: regHeight * 8,
        // width: "100%"
    },
    bookimage: {
        width: regWidth * 160,
        height: regWidth * 160,
        resizeMode: "contain",
    },
    titleTxt: {
        color: "black",
        marginVertical: regHeight * 10,
        marginRight: regWidth * 15,
        fontSize: regWidth * 15,
    },
    authorTxt: {
        color: "black",
        marginVertical: regHeight * 10,
        fontSize: regWidth * 12,
    },
})