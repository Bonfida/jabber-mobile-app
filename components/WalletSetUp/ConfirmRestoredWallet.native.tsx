import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { loadKeyPairFromMnemonicOrPrivateKey } from "../../utils/wallet.native";
import { IStep } from "../../types";
import BlueButton, { BlueButtonWhiteBg } from "../Buttons/BlueGradient";
import GlobalStyle from "../../Style";
import LightGradientCard from "../Cards/LightGradientCard";

const ButtonSection = ({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<IStep>>;
}) => {
  const onPressBack = () => {
    setStep(IStep.Restore);
  };
  const onPressCreate = () => {
    setStep(IStep.BuyDomain);
  };

  return (
    <View style={styles.buttonSection}>
      <BlueButtonWhiteBg
        style={styles.buttonStyle}
        onPress={onPressBack}
        borderRadius={28}
        width={103}
        height={56}
      >
        <Text style={[GlobalStyle.blue, styles.buttonText]}>Back</Text>
      </BlueButtonWhiteBg>
      <BlueButton
        style={styles.buttonStyle}
        onPress={onPressCreate}
        borderRadius={28}
        width={208}
        height={56}
        transparent
      >
        <Text style={[GlobalStyle.white, styles.buttonText]}>
          Get connected
        </Text>
      </BlueButton>
    </View>
  );
};

export const ConfirmRestoredWallet = ({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<IStep>>;
}) => {
  const [address, setAddress] = useState<null | string>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    const fn = async () => {
      if (!mountedRef.current) return;
      const mnemonic = await SecureStore.getItemAsync("mnemonic");
      if (!mnemonic) return;
      const [account] = await loadKeyPairFromMnemonicOrPrivateKey(mnemonic);
      if (!mountedRef.current || !account) return null;
      setAddress(account.publicKey.toBase58());
    };
    fn();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.explanationContainer}>
        <LightGradientCard borderRadius={20} height={200} width={"100%"}>
          <View style={styles.innerCard}>
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>👇</Text>
            </View>
            <View style={styles.addressContainer}>
              <Text style={styles.address}>{address}</Text>
            </View>
          </View>
        </LightGradientCard>
        <Text style={[GlobalStyle.h1, { marginTop: 30 }]}>Confirm address</Text>
        <Text style={[GlobalStyle.text, { marginTop: 10 }]}>
          Check to ensure this is your wallet address
        </Text>
      </View>
      <ButtonSection setStep={setStep} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  innerCard: {
    position: "relative",
    height: "100%",
  },
  address: {
    fontSize: 24,
    flexShrink: 1,
    color: "#77E3EF",
    width: "95%",
  },
  addressContainer: {
    bottom: 10,
    position: "absolute",
    width: "100%",
    left: 10,
  },
  mask: {
    height: 30,
  },
  emoji: {
    fontSize: 68,
  },
  emojiContainer: {
    position: "absolute",
    top: 5,
    left: 0,
  },
  root: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
  buttonSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonStyle: {
    margin: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  explanationContainer: {
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
  },
});
