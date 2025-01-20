import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import Video, { OnPlaybackStateChangedData } from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome';
import Orientation from 'react-native-orientation-locker';

const VideoPlayer = ({ uri, visible, setVisible, onProgress, onPlaying, timeStart = 0, onEnd }) => {
    const [fullscreen, setFullscreen] = useState(false);
    const [paused, setPaused] = useState(true);
    const videoRef = useRef(null);

    useEffect(() => {
        if (visible) {
            // Mở fullscreen khi video hiển thị
            handleFullscreen(true);
        } else {
            if (Orientation) {
                Orientation.lockToPortrait();
            }
        }
    
        return () => {
            if (Orientation) {
                Orientation.lockToPortrait(); // Đảm bảo trở về hướng dọc khi component unmount
            }
        };
    }, [visible]);

    const handleFullscreen = (enable) => {
        setFullscreen(enable);
        if (enable) {
            Orientation.lockToLandscape(); // Khóa màn hình ngang
        } else {
            Orientation.lockToPortrait(); // Khóa màn hình dọc
        }
    };

    const handleClose = () => {
        setVisible(false);
        handleFullscreen(false);
    };

    const onLoad = (data) => {
        if (videoRef.current) {
            videoRef.current.seek(timeStart);
        } else {
            console.log('Video ref is not ready');
        }
    };
    const onPlaybackStateChanged = (state: OnPlaybackStateChangedData) => {
        if (state.isPlaying) {
            console.log('VideoPlayer - onPlaybackStateChanged - playing');
            onPlaying(); 
        }
        console.log('Playback state changed:', state); 
    };

    const togglePlayPause = () => {
        setPaused((prevPaused) => !prevPaused); // Đảo trạng thái play/pause
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible}>
            <View style={styles.container}>
                <Video
                    ref={videoRef}
                    source={{ uri }}
                    style={fullscreen ? styles.fullscreenVideo : styles.video}
                    resizeMode="contain"
                    paused={false}
                    controls={true}
                    onLoad={onLoad}
                    onPlaybackStateChanged={onPlaybackStateChanged}
                    onProgress={onProgress}
                    onEnd={onEnd}
                />
                <View style={styles.closeButton}>
                    <TouchableOpacity onPress={handleClose}>
                        <Icon name="close" size={30} color="white" />
                    </TouchableOpacity>
                </View>
                {!fullscreen && (
                    <View style={styles.fullscreenButton}>
                        <TouchableOpacity onPress={() => handleFullscreen(true)}>
                            <Icon name="arrows-alt" size={30} color="white" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </Modal>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    video: {
        width: width,
        height: height / 2,
    },
    fullscreenVideo: {
        width: height, 
        height: width,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
    },
    fullscreenButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
});

export default VideoPlayer;
