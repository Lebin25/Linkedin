import { StyleSheet, Text, View, ScrollView, Pressable, Image, TextInput } from 'react-native'
import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { Ionicons, Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";
import { useRouter } from "expo-router";

const index = () => {
   const [userId, setUserId] = useState("");
   const [user, setUser] = useState();
   const [posts, setPosts] = useState([]);
   const [isLiked, setIsLiked] = useState(false);
   const router = useRouter();

   useEffect(() => {
      const fetchUser = async () => {
         const token = await AsyncStorage.getItem("authToken");
         const decodedToken = jwt_decode(token);
         const userId = decodedToken.userId;
         setUserId(userId);
      };

      fetchUser();
   }, []);

   useEffect(() => {
      if (userId) {
         fetchUserProfile();
      }
   }, [userId]);

   const fetchUserProfile = async () => {
      try {
         const response = await axios.get(
            `http://10.0.2.2:3000/profile/${userId}`
         );
         const userData = response.data.user;
         setUser(userData);
      } catch (error) {
         console.log("error fetching user profile", error);
      }
   };

   const fetchAllPosts = async () => {
      try {
         const response = await axios.get("http://10.0.2.2:3000/all");
         setPosts(response.data.posts);
      } catch (error) {
         console.log("error fetching posts", error);
      }
   };

   useEffect(() => {
      fetchAllPosts();
   }, []);

   const MAX_LINES = 2;
   const [textShown, setTextShown] = useState(false);
   const [lengthMore, setLengthMore] = useState(false);

   const toggleNumberOfLines = () => {
      setTextShown(!textShown);
   }

   const onTextLayout = useCallback(e => {
      setLengthMore(e.nativeEvent.lines.length > MAX_LINES);
   }, []);

   const handleLikePost = async (postId) => {
      try {
         const response = await axios.post(
            `http://10.0.2.2:3000/like/${postId}/${userId}`
         );
         if (response.status === 200) {
            const updatedPost = response.data.post;
            setIsLiked(updatedPost.likes.some((like) => like.user === userId));
            fetchAllPosts();
         }
      } catch (error) {
         console.log("Error liking/unliking the post", error);
      }
   };

   return (
      <ScrollView>
         <View
            style={{
               padding: 10,
               flexDirection: "row",
               alignItems: "center",
               gap: 4,
            }}
         >
            <Pressable onPress={() => router.push("/home/profile")}>
               <Image
                  style={{ width: 30, height: 30, borderRadius: 15 }}
                  source={{ uri: user?.profileImage }}
               />
            </Pressable>

            <Pressable
               style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 7,
                  gap: 10,
                  backgroundColor: "white",
                  borderRadius: 3,
                  height: 30,
                  flex: 1,
               }}
            >
               <AntDesign
                  style={{ marginLeft: 10 }}
                  name="search1"
                  size={20}
                  color="black"
               />
               <TextInput placeholder="Search" />
            </Pressable>

            <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
         </View>

         <View>
            {posts?.map((item, index) => (
               <View key={index}>
                  <View
                     style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginHorizontal: 10,
                     }}
                     key={index}
                  >
                     <View
                        style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
                     >
                        <Image
                           style={{ width: 60, height: 60, borderRadius: 30 }}
                           source={{ uri: item?.user?.profileImage }}
                        />

                        <View style={{ flexDirection: "column", gap: 2 }}>
                           <Text style={{ fontSize: 15, fontWeight: "600" }}>
                              {item?.user?.name}
                           </Text>
                           <Text
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={{
                                 width: 230,
                                 color: "gray",
                                 fontSize: 15,
                                 fontWeight: "400",
                              }}
                           >
                              Engineer Graduate | LinkedIn Member
                           </Text>
                           <Text style={{ color: "gray" }}>
                              {moment(item.createdAt).format("MMMM Do YYYY")}
                           </Text>
                        </View>
                     </View>

                     <View
                        style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
                     >
                        <Entypo name="dots-three-vertical" size={20} color="black" />

                        <Feather name="x" size={20} color="black" />
                     </View>
                  </View>

                  <View
                     style={{ marginTop: 10, marginHorizontal: 10, marginBottom: 12 }}
                  >
                     <Text
                        onTextLayout={onTextLayout}
                        style={{ fontSize: 15 }}
                        numberOfLines={textShown ? undefined : MAX_LINES}
                     >
                        {item?.description}
                     </Text>
                     {
                        lengthMore ? <Text
                           onPress={toggleNumberOfLines}
                           style={{ lineHeight: 21, marginTop: 10 }}>{textShown ? 'Read less...' : 'Read more...'}</Text>
                           : null
                     }
                  </View>

                  <Image
                     style={{ width: "100%", height: 240 }}
                     source={{ uri: item?.imageUrl }}
                  />

                  {item?.likes?.length > 0 && (
                     <View
                        style={{
                           padding: 10,
                           flexDirection: "row",
                           alignItems: "center",
                           gap: 6,
                        }}
                     >
                        <SimpleLineIcons name="like" size={16} color="#0072b1" />
                        <Text style={{ color: "gray" }}>{item?.likes?.length}</Text>
                     </View>
                  )}

                  <View
                     style={{
                        height: 2,
                        borderColor: "#E0E0E0",
                        borderWidth: 2,
                     }}
                  />

                  <View
                     style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-around",
                        marginVertical: 10,
                     }}
                  >
                     <Pressable onPress={() => handleLikePost(item?._id)}>
                        <AntDesign
                           style={{ textAlign: "center" }}
                           name="like2"
                           size={24}
                           color={item?.likes.some((like) => like.user === userId) ? "#0072b1" : isLiked ? "#0072b1" : "gray"}
                        />
                        <Text
                           style={{
                              textAlign: "center",
                              fontSize: 12,
                              color: item?.likes.some((like) => like.user === userId) ? "#0072b1" : isLiked ? "#0072b1" : "gray",
                              marginTop: 2,
                           }}
                        >
                           Like
                        </Text>
                     </Pressable>
                     <Pressable>
                        <FontAwesome
                           name="comment-o"
                           size={20}
                           color="gray"
                           style={{ textAlign: "center" }}
                        />
                        <Text
                           style={{
                              textAlign: "center",
                              marginTop: 2,
                              fontSize: 12,
                              color: "gray",
                           }}
                        >
                           Comment
                        </Text>
                     </Pressable>
                     <Pressable>
                        <Ionicons
                           name="md-share-outline"
                           size={20}
                           color="gray"
                           style={{ textAlign: "center" }}
                        />
                        <Text
                           style={{
                              marginTop: 2,
                              fontSize: 12,
                              textAlign: "center",
                              color: "gray",
                           }}
                        >
                           Repost
                        </Text>
                     </Pressable>
                     <Pressable>
                        <Feather name="send" size={20} color="gray" />
                        <Text style={{
                           marginTop: 2,
                           fontSize: 12,
                           color: "gray"
                        }}
                        >
                           Send
                        </Text>
                     </Pressable>
                  </View>
               </View>
            ))}
         </View>
      </ScrollView>
   )
}

export default index

const styles = StyleSheet.create({})