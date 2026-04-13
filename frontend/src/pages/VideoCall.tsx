import React, { useCallback, useEffect, useState } from "react";
import { Card, Form, Input, Button } from "antd";
import { Mail } from "lucide-react";
import { MdRoom } from "react-icons/md";
import { useSocket } from "../contexts/SocketContext";
import ReactPlayer from "react-player";
import peer from "../services/peer";
const VideoCall: React.FC = () => {
  // const [loading, setLoading] = useState(false);
  const [videoRoom, setVideoRoom] = useState(false);
  const [myStream, setMyStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();
  const [remoteSocketId, setRemoteSocketId] = useState<string>();
  const { socket } = useSocket();
  // console.log("Socket", socket);
  const onFinish = async (data: { email: string; room: string }) => {
    // console.log(data);
    socket.emit("Room:Join", data);
  };

  const handleJoinRoom = (data: object) => {
    console.log("Data from Backend", data);
    setVideoRoom(true);
  };

  

  useEffect(() => {
    socket.on("Room:Join", handleJoinRoom);
    return () => {
      socket.off("Room:Join", handleJoinRoom);
    };
  }, []);
  
  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);
  useEffect(() => {
    const handleUserJoined = async (data: { email: string; id: string }) => {
      console.log("User Joined", data);
      setRemoteSocketId(data.id);
      const offer = await peer.getOffer();
      socket.emit("User:Call", { to: data.id, offer });
    };
    const handleIncomingCall = async (data: {
      from: string;
      offer: RTCSessionDescriptionInit;
    }) => {
      setRemoteSocketId(data.from)
      console.log("Incoming Call", data);
      const ans = await peer.getAnswer(data.offer);
      socket.emit("User:Call Accepted", { to: data.from, ans });
    };
    const handleCallAccepted = async (data: {
      from: string;
      ans: RTCSessionDescriptionInit;
    }) => {
     peer.setLocalDescription(data.ans)
    // peer.setRemoteAnswer(data.ans);
     console.log("Call Accepted")
     for (const track of myStream!.getTracks()){
       peer.peer.addTrack(track,myStream!)
     } 
    };
  
    socket.on("User:Joined", handleUserJoined);
    socket.on("User:Incomming Call", handleIncomingCall);
    socket.on("User:Call Accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    return () => {
      socket.off("User:Joined", handleUserJoined);
      socket.off("User:Incomming Call", handleIncomingCall);
      socket.off("User:Call Accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [socket, myStream, handleNegoNeedIncomming, handleNegoNeedFinal]);

 

  useEffect(() => {
    const handleOpenVideo = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      setMyStream(stream);
    };
    if (videoRoom) handleOpenVideo();
  }, [videoRoom, socket]);
  
  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);
  return (
    <div className=" mx-auto my-8">
      <Card title="Video Call" className="shadow-md min-w-[80vw] min-h-full">
        {!videoRoom && (
          <Form layout="vertical" onFinish={onFinish} autoComplete="off">
            {/* Email Field */}

            <Form.Item
              label="Email"
              name="email"
              hasFeedback
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<Mail size={16} className="text-gray-400" />}
                placeholder="Enter your email"
              />
            </Form.Item>
            <Form.Item
              label="Room No."
              name="room"
              hasFeedback
              rules={[
                { required: true, message: "Please enter the room number!" },
              ]}
            >
              <Input
                prefix={<MdRoom size={16} className="text-gray-400" />}
                placeholder="Enter the room number"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                // loading={loading}
                block
              >
                Sumbit
              </Button>
            </Form.Item>
          </Form>
        )}
        {videoRoom && (
          <>
            <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
            {myStream && (
              <ReactPlayer
                muted
                style={{ transform: "scaleX(-1)" }}
                playing
                url={myStream}
                width={300}
                height={200}
              />
            )}
            {remoteStream && (
              <ReactPlayer
                muted
                style={{ transform: "scaleX(-1)" }}
                playing
                url={remoteStream}
                width={300}
                height={200}
              />
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default VideoCall;
