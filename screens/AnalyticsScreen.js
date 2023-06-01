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


const AnalyticsScreen = () => {
    const realm = useRealm();
    const [odoks, setOdoks] = useState(realm.objects("Odok"));
    const [books, setBooks] = useState(realm.objects("Book"));
    const [totalTime, setTotalTime] = useState(0);
    const [mostBook, setMostBook] = useState('');
    
    const hour = parseInt( totalTime / 3600);
    const minute = parseInt((totalTime - hour*3600) / 60);
    const second = totalTime % 60;

    useEffect(() => {
        let count = 0;
        let bookList = [];

        odoks.map((odok) => {
            // console.log(odok.read_time);
            count = count + odok.read_time;

            bookList[odok.book_id] = bookList[odok.book_id] ? bookList[odok.book_id]+1 : 1;
        })
        setTotalTime(count);

        let maxIndex = null;
        bookList.map((bookCount, index) => {
            console.log(bookCount, bookList[maxIndex]);
            if (bookCount) {
                if (!maxIndex) {
                    maxIndex = index;
                } else {
                    maxIndex = bookCount > bookList[maxIndex] ? index : maxIndex;
                }
            }
        })
        console.log(maxIndex);
        setMostBook(books.filtered("_id == $0", maxIndex)[0].title)
    }, [])

    return(
        <View style={styles.container}>
            <Text style={styles.txt}>
                Analytics
            </Text>
            <Text style={styles.txt}>
                Your total reading time is
            </Text>
            <Text style={{...styles.txt, color: "blue"}}>
                {hour}h {minute}m {second}s
            </Text>
            <Text style={styles.txt}>
                The book you read the most is
            </Text>
            <Text style={{...styles.txt, color: "blue"}}>
                {mostBook}
            </Text>
        </View>
    );
}

export {AnalyticsScreen};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    txt: {
        color: "black",
        fontSize: regWidth * 18,
    }

})