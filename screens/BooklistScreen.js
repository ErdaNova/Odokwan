import { Text, View, ScrollView, StyleSheet, FlatList, TouchableHighlight, Image, Pressable, TouchableOpacity, TextInput } from "react-native";
import { React, useEffect, useState } from "react";
// import {Icon} from "@rneui/themed"
import { Button, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import { useQuery } from "../App";
import { Book } from "../App";
import { SearchBar } from '@rneui/themed';
import { useRealm } from "../App";

// type BookData = {
//     title: String;
//     author: String;
//     page_number: Number;
//     image: Number;
//     status: Number;
// };





const BooklistScreen = ({navigation}) => {
    


    const [filtered, setFiltered] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    const handleSearchIconOnClick = () => {
        setSearchVisible(true);
    };
    

    const realm = useRealm();
    const odoks = realm.objects("Odok");

    const deleteBook = (target) => {
        const bookTitle = target.title;
        const importantOdoks = odoks.filtered("title == $0", bookTitle);

        Alert.alert("","Do you really want to delete? Odok will be deleted together.", [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {text: 'OK', onPress: () => {
                realm.write(() => {
                    realm.delete(target)
                    importantOdoks.map((item) => realm.delete(item))
                })
                
            }},
          ])
    }

    const [books, setBooks] = useState(useQuery(Book));

    const Item = ({item, onPress, backgroundColor, textColor}) => (
        <TouchableOpacity onPress={onPress} style = {[styles.book, {backgroundColor}]} activeOpacity={0.7} >
        <View style={styles.bookcontainer}>
            <View style = {{flexDirection:"column"}}>
            <Image 
                style={styles.bookimage}
                source={{uri : item.image}}
            />
            <Button
                title="delete"
                onPress={() => deleteBook(item)}
            />
            </View>
            <View style={{flex: 0.1}}/>
            <View style={styles.titlecontainer}>
                <View style={{alignSelf: "flex-end"}}>{status_icon(item.status)}
                </View>
                <Text style={[styles.title, {color: textColor}]}>{item.title}</Text>
                <Text style={[styles.title, {color: textColor}]}>{item.author}</Text>
            </View>
        </View>
        </TouchableOpacity>
    );



    const updateSearch = (search) => {
        setSearchInput(search);
        const filteredBooks = books.filter((book) =>
            book.title.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(filteredBooks);

    };

    const renderItem = ({item}) => {
        const backgroundColor = "white";
        const color = "black";
        return (
            <Item
                item={item}
                //onPress={()=>{alert("Clicked " + item.title); alert("click click")}}
                onPress={()=>{navigation.navigate("BookDetail", 
                {
                    title: item.title, 
                    author: item.author, 
                    page: item.page, 
                    image: item.image,
                    status: item.status,
                    readPage : item.readPage,
                    id : item._id
                })}}
                backgroundColor={backgroundColor}
                textColor={color}
            />
        );
    };

    return(
        <View style={{flex:1}}>
            <View style={{height : 70}}>

            <SearchBar
                placeholder="Type Book title" value = {searchInput} onChangeText={updateSearch} 
                containerStyle ={{backgroundColor:"#000333"}} inputContainerStyle = {{backgroundColor:"#FFFFF0"}}
                />
        
            </View>
        <View style={{flex:1}}>
                <FlatList
                    data={searchInput ? filtered : books}
                    renderItem={renderItem}
                />
                <View style={{height:100}}></View>

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
    bookcontainer: {
        flex: 1,
        flexDirection: 'row',
    },
    titlecontainer: {
        flexDirection: "column",
        flex: 1,
    },
    book: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        color: "black",
        marginVertical: 10,
        fontSize: 12,
    },
    bookimage: {
        width: 50,
        height: 80,
    },
    status_icon: {
        width: 50,
        height: 25,
        borderRadius: 5,
        justifyContent: "center",
        borderWidth: 1,
    },
    toolbar_container: {
        height : 60,
        backgroundColor: 'white',
    },
    toolbar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
    toolbar_title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    search_icon: {
        marginLeft: 10,
    },
    toolbar_search: {
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: "white",
        paddingLeft: 10,
        paddingRight: 10,
        width : 250
    },
})
export {BooklistScreen};