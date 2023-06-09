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
        console.log(odoks);
        if (odoks.length > 0) {
            odoks.map((odok) => {
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
        }
    }, [])

    return(
        <View style={styles.container}>

        <Text style={{fontWeight: "bold", fontSize: 30, marginBottom: 20}}>
                Analytics
        </Text>
            <View style={styles.rectangle}>
            <View style={styles.userIcon}>
              {/* You can replace this with your user icon */}
              <Text>User Icon</Text>
            </View>
            {odoks.length > 0 ? 
                <>
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
                </>
                : 
                <Text style={styles.txt}>
                    Create your Odoks!
                </Text>
            }
            </View>

        </View>
    );
}

export {AnalyticsScreen};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 20,
    },
    txt: {
        color: "black",
        fontSize: regWidth * 18,
        margin: regWidth * 2,
    },
    rectangle: {
        backgroundColor: 'white',
        width: 300,
        height: 300,
        borderRadius: 10,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
      userIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#C0C0C0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
      },
      pagesText: {
        fontSize: 20,
        marginBottom: 10,
      },
      timeText: {
        fontSize: 16,
      },

})