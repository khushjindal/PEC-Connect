import React, { useState } from "react";
import { Button, TextInput, View, ScrollView } from "react-native";
import { Snackbar } from "react-native-paper";
import { container, form } from "../styles";
import { firebaseConfig } from "../../firebase_config/firebaseConfig";
import { initializeApp } from "firebase/app";
import RadioButtonRN from "radio-buttons-react-native";
import * as Updates from "expo-updates";
import {
  doc,
  getFirestore,
  collection,
  query,
  where,
  setDoc,
  getDocs,
} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export default function Register(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [type, setType] = useState("");
  const [isValid, setIsValid] = useState(true);
  const onLogout = async () => {
    auth.signOut();
    Updates.reloadAsync();
  };
  const onRegister = async () => {
    if (
      name.length == 0 ||
      username.length == 0 ||
      email.length == 0 ||
      password.length == 0
    ) {
      setIsValid({
        bool: true,
        boolSnack: true,
        message: "Please fill out everything",
      });
      return;
    }
    if (password.length < 6) {
      setIsValid({
        bool: true,
        boolSnack: true,
        message: "passwords must be at least 6 characters",
      });
      return;
    }
    const usersCollectionRef = collection(db, "users");
    const q = query(usersCollectionRef, where("username", "==", username));
    try {
      const snapshot = await getDocs(q);
      if (!snapshot.exist) {
        createUserWithEmailAndPassword(auth, email, password)
          .then(async () => {
            if (snapshot.exist) {
              return;
            }
            if (type == "Student") {
              await setDoc(doc(db, "users", auth.currentUser.uid), {
                name: name,
                email: email,
                username: username,
                image: "default",
                type: "Student",
                branch: "",
                summary: "",
                year_of_study: "",
                sid: "",
                mobile_number: "",
                academic_proficiency: "",
                org_of_internship: "",
                org_of_placement: "",
                technical_skills: "",
                interests: [],
                achievements: "",
              });
            } else if (type == "Faculty") {
              await setDoc(doc(db, "users", auth.currentUser.uid), {
                name: name,
                email: email,
                username: username,
                image: "default",
                type: "Faculty",
                department: "",
                summary: "",
                designation: "",
                eid: "",
                mobile_number: "",
                technical_skills: "",
                interests: [],
              });
            } else if (type == "Secretary") {
              await setDoc(doc(db, "users", auth.currentUser.uid), {
                name: name,
                email: email,
                username: username,
                image: "default",
                type: "Secretary",
                summary: "",
                department: "",
                technical_club_cultural_club_nss_ncc_sports: "",
                designation: "",
                sid: "",
                mobile_number: "",
                interests: [],
              });
            } else {
              await setDoc(doc(db, "users", auth.currentUser.uid), {
                name: name,
                email: email,
                username: username,
                image: "default",
                type: "Webmaster",
                eid: "",
                summary: "",
                designation: "",
                mobile_number: "",
                interests: [],
              });
            }
          })
          .catch(() => {
            setIsValid({
              bool: true,
              boolSnack: true,
              message: "Something went wrong",
            });
          });
      }
    } catch (err) {
      console.log(err);
      setIsValid({
        bool: true,
        boolSnack: true,
        message: "Something went wrong",
      });
    }
  };
  const data = [
    {
      label: "Faculty",
    },
    {
      label: "Student",
    },
    {
      label: "Secretary",
    },
    {
      label: "Webmaster",
    },
  ];
  return (
    <ScrollView>
      <View style={container.center}>
        <View style={container.formCenter}>
          <TextInput
            style={form.textInput}
            placeholder="Username"
            value={username}
            keyboardType="twitter"
            onChangeText={(username) =>
              setUsername(
                username
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .replace(/\s+/g, "")
                  .replace(/[^a-z0-9]/gi, "")
              )
            }
          />
          <TextInput
            style={form.textInput}
            placeholder="name"
            onChangeText={(name) => setName(name)}
          />
          <TextInput
            style={form.textInput}
            placeholder="email"
            onChangeText={(email) => setEmail(email)}
          />
          <TextInput
            style={form.textInput}
            placeholder="password"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          <RadioButtonRN
            data={data}
            selectedBtn={(e) => {
              setType(e.label);
            }}
          />
          <View
            style={{
              height: 10,
            }}
          />
          <Button
            style={form.button}
            onPress={() => onRegister()}
            title="Register"
          />
        </View>

        <Snackbar
          visible={isValid.boolSnack}
          duration={2000}
          onDismiss={() => {
            setIsValid({ boolSnack: false });
          }}
        >
          {isValid.message}
        </Snackbar>
      </View>
    </ScrollView>
  );
}
