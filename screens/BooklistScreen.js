import { Text, View, ScrollView, StyleSheet, FlatList, TouchableHighlight, Image, Pressable, TouchableOpacity, TextInput } from "react-native";
import { React, useState } from "react";
// import {Icon} from "@rneui/themed"
import { Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, regWidth, regHeight} from '../config/globalStyles';

// type BookData = {
//     title: String;
//     author: String;
//     page_number: Number;
//     image: Number;
//     status: Number;
// };

const tempData = [
    {
        title: "Harry Potter and the Philosopher's Stone",
        author: "J. K. Rowling",
        page_number: 223,
        image: require("./img/harrypotter_1.jpg"),
        status: 0,
    },
    {
        title: "Harry Potter and the Chamber of Secrets",
        author: "J. K. Rowling",
        page_number: 251,
        image: require("./img/harrypotter_2.jpg"),
        status: 1,
    },
        {
        title: "Harry Potter and the Chamber of Secrets",
        author: "J. K. Rowling",
        page_number: 251,
        image: require("./img/harrypotter_2.jpg"),
        status: 0,
    },
    {
        title: "Harry Potter and the Chamber of Secrets",
        author: "J. K. Rowling",
        page_number: 251,
        image: require("./img/harrypotter_2.jpg"),
        status: 1,
    },
    {
        title: "Harry Potter and the Chamber of Secrets",
        author: "J. K. Rowling",
        page_number: 251,
        image: require("./img/harrypotter_2.jpg"),
        status: 1,
    },
    {
        title: "Harry Potter and the Chamber of Secrets",
        author: "J. K. Rowling",
        page_number: 251,
        image: require("./img/harrypotter_2.jpg"),
        status: 1,
    },
    {
        title: "Harry Potter and the Chamber of Secrets",
        author: "J. K. Rowling",
        page_number: 251,
        image: require("./img/harrypotter_2.jpg"),
        status: 1,
    },
];

const Item = ({item, onPress, backgroundColor, textColor}) => (
    <TouchableOpacity onPress={onPress} style = {[styles.book, {backgroundColor}]} activeOpacity={0.7} >
        <View style={styles.bookcontainer}>
            <Image 
                style={styles.bookimage}
                source={item.image}
            />
            {/* <View style={{flex: 0.1}}/> */}
            <View style={styles.titlecontainer}>
                <View style={{alignSelf: "flex-end"}}>{status_icon(item.status)}</View>
                <Text style={[styles.title, {color: textColor}]}>{item.title}</Text>
                <Text style={[styles.title, {color: textColor}]}>{item.author}</Text>
            </View>
        </View>
    </TouchableOpacity>
);


const BooklistScreen = ({navigation}) => {

    const [searchVisible, setSearchVisible] = useState(false);
    const [searched, setSearched] = useState('');
    const [filtered, setFiltered] = useState([]);

    const handleSearchIconOnClick = () => {
        setSearchVisible(true);
    };

    const handleSearchIconCancel = () => {
        setSearchVisible(false);
        setSearched('');
        setFiltered([]);
    };

    const handleSearchItem = () => {
        const filteredBooks = tempData.filter((book) =>
            book.title.toLowerCase().includes(searched.toLowerCase())
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
                    page_number: item.page_number, 
                    image: item.image,
                    status: item.status,
                })}}
                backgroundColor={backgroundColor}
                textColor={color}
            />
        );
    };

    return(
        <View style={styles.container}>
            <View style={styles.toolbar_container}>
                {/* {searchVisible ? (
                    <View style={styles.toolbar}> 
                        <TouchableOpacity style={styles.search_icon} onPress={handleSearchIconCancel}>
                            <Icon name="arrow-back-outline" size={24} color="black"/>
                        </TouchableOpacity>
                        <TextInput 
                            style={styles.toolbar_search}
                            placeholder="keyword"
                            value={searched}
                            onChangeText={setSearched}
                            multiline={true}
                            autoFocus
                        />
                        <TouchableOpacity style={styles.search_icon} onPress={handleSearchItem}>
                            <Icon name="search" size={24} color="black"/>
                        </TouchableOpacity>
                    </View>
                    ) : (
                        <View style={styles.toolbar}>
                            <Text style={styles.toolbar_title}>Reading List</Text>
                            <TouchableOpacity style={styles.search_icon} onPress={handleSearchIconOnClick}>
                                <Icon name="search" size={24} color="black"/>
                            </TouchableOpacity>
                        </View>
                    )
                } */}
                <View style={styles.toolbar}> 
                    <TextInput 
                        style={styles.toolbar_search}
                        placeholder="keyword"
                        value={searched}
                        onChangeText={setSearched}
                        onSubmitEditing={handleSearchItem}
                        // multiline={true}
                        // autoFocus
                    />
                    <TouchableOpacity style={styles.search_icon} onPress={handleSearchItem}>
                        <Icon name="search" size={regWidth * 24} color="black"/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{flex: 2}}>
                <FlatList
                    data={filtered.length > 0 ? filtered : tempData}
                    renderItem={renderItem}
                    style={{
                        marginBottom: regHeight * 120,
                    }}
                />
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
        alignItems: "center",
        paddingVertical: regHeight * 12,
        paddingRight: regWidth * 12,
    },
    titlecontainer: {
        flexDirection: "column",
        flex: 1,
    },
    book: {
        // padding: 20,
        marginVertical: regHeight * 8,
        marginHorizontal: regWidth * 16,
    },
    title: {
        color: "black",
        marginVertical: regHeight * 10,
        fontSize: regWidth * 12,
    },
    bookimage: {
        width: regWidth * 100,
        height: regWidth * 100,
        resizeMode: "contain",
    },
    status_icon: {
        width: 50,
        height: 25,
        borderRadius: 5,
        justifyContent: "center",
        borderWidth: 1,
    },
    toolbar_container: {
        // flex: 1,
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
        // marginLeft: 10,
    },
    toolbar_search: {
        borderWidth: regWidth * 1,
        borderColor: 'black',
        backgroundColor: "white",
        margin: regWidth * 10,
        padding: 0,
        paddingHorizontal: regWidth * 10,
        fontSize: regWidth * 18,
        width: "85%",
    },
})
export {BooklistScreen};