import React, {useEffect, useRef, useState} from 'react';
import '../styles/Canvas.scss'
import {observer} from "mobx-react-lite";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import {useParams} from 'react-router-dom';
import {Modal} from "antd";
import Rect from "../tools/Rect";
import axios from "axios";
import Circle from "../tools/Circle";
import Eraser from "../tools/Eraser";
import Line from "../tools/Line";


export const Canvas = observer(() => {

    const canvasRef = useRef()
    const usernameRef = useRef()

    const params = useParams()

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current)
        axios.get(`http://localhost:5000/image?id=${params.id}`)
            .then(response => {
                const img = new Image()
                img.src = response.data

                img.onload = () => {
                    canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                    canvasRef.current.getContext('2d').drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
                    canvasRef.current.getContext('2d').stroke()
                }
            })
    }, [])

    useEffect(() => {
        if (canvasState.username) {
            const ws = new WebSocket(`ws://localhost:5000/`)
            canvasState.setSocket(ws)
            canvasState.setSessionId(params.id)
            toolState.setTool(new Brush(canvasRef.current, ws, params.id))

            ws.onopen = () => {
                console.log('open')
                ws.send(JSON.stringify({
                    id: params.id,
                    username: canvasState.username,
                    method: "connection"
                }))
            }
            ws.onmessage = (event) => {
                let msg = JSON.parse(event.data)

                switch (msg.method) {
                    case "connection":
                        console.log(`User ${msg.username} connected`)
                        break
                    case "draw":
                        drawHandler(msg)
                        break
                }
            }
        }
    }, [canvasState.username])

    const drawHandler = (msg) => {
        const figure = msg.figure
        const ctx = canvasRef.current.getContext('2d')

        switch (figure.type) {
            case "brush":
                Brush.draw(ctx, figure.x, figure.y)
                break
            case "rect":
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color, figure.strokeColor, figure.lineWidth)
                break
            case "circle":
                Circle.staticDraw(ctx, figure.x, figure.y, figure.radius, figure.color, figure.strokeColor, figure.lineWidth)
                break
            case "eraser":
                Eraser.draw(ctx, figure.x, figure.y, figure.lineWidth)
                break
            case "line":
                Line.staticDraw(ctx, figure.xStart, figure.yStart, figure.xEnd, figure.yEnd, figure.lineWidth, figure.strokeColor)
                break
            case "finish":
                ctx.beginPath()
                break
        }
    }

    const mouseDownHandler = () => {
        canvasState.pushToUndoList(canvasRef.current.toDataURL())

        axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
            .then(response => console.log(response.data))
    }

    const [isModalVisible, setIsModalVisible] = useState(true);

    const connectionHandler = () => {
        canvasState.setUsername(usernameRef.current.value)
        setIsModalVisible(false)
    }

    return (
        <div className='canvas'>
            <Modal title="Hello"
                   visible={isModalVisible}
                   onOk={connectionHandler}>
                <div>Enter your username</div>
                <input ref={usernameRef} type='text'/>
            </Modal>
            <canvas onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={1000} height={500}/>
        </div>
    );
})