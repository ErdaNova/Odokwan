import * as React from 'react';
import { Button, TouchableOpacity, View } from 'react-native';
import 'react-native-gesture-handler';
import { Text } from 'react-native';
import axios from 'axios';
import { useState } from 'react';
import { FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '@rneui/themed';
import { ScrollView } from 'native-base';



const SearchBookScreen = ({navigation}) => {

  const [searchResult, setSearchResult] = useState(Array());
  const [searchInput, setSearchInput] = useState("");

    const searchBook = async (input) => {
        try {
          const response = await axios.get(
            "https://openapi.naver.com/v1/search/book.json",
            {params:{query : input},
            headers :{
                "X-Naver-Client-Id" : "cxxfk1HU9t3_bFTabFza",
                "X-Naver-Client-Secret" : "zeJoQHiNTp"
            }
          }
          );
          setSearchResult(response.data.items);
          // console.log(response.data.items);
          // console.log(typeof(response.data));
          console.log(response.data.items);
          console.log(typeof(response.data.items));
          console.log(response.data.items instanceof Array);
        } catch (e) {
          console.log("failed");
          setSearchResult([]);
        }
      };

    const updateSearch = (search) => {
        setSearchInput(search);
        searchBook(search);

    };



    return(
        <View style={{flex:1}}>
            {/* <Text>
                here is odoktimer page
            </Text> */}
            {/* <Button
            title="go to book info"
            onPress={() => navigation.navigate("BookInfo")}
       /> */}

        {/* <Button
            title="search book"
            onPress={searchBook}
       /> */}
       <View style={{height : 90}}>
        <View style = {{ width : "100%", height:"80%"}}>
          <SearchBar
            placeholder="Type Book title or Author" value = {searchInput} onChangeText={updateSearch} 
            containerStyle ={{backgroundColor:"#000333"}} inputContainerStyle = {{backgroundColor:"#FFFFF0"}}
            />
        </View>

      </View>


        <FlatList
          data={searchResult}
          renderItem={({item}) => 
          <View style = {{width:"100%", height: 80, flexDirection : "row", alignContent:"center", justifyContent:"center"}} >
            <TouchableOpacity style = {{width:"90%", height: "90%", padding : 10, flexDirection : "row", backgroundColor:"#ffffff"}}
              onPress={() => navigation.navigate("BookInfo",
              {
                title: item.title, 
                author: item.author, 
                page_number: 0, 
                image: item.image,
              })}>
            <View>
              <Image  style = {{height : 56, width : 40}} source={{uri : item.image}} />
              </View>
              <View>
                <Text style = {{ width : "80%"}}>{item.title}</Text>
                <Text>{item.author}</Text>
              </View>
            </TouchableOpacity>
          </View>
          }
        />




       
        </View>
    );
}

export {SearchBookScreen};