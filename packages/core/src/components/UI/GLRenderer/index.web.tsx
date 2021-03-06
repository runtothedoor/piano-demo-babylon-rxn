import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {Engine, Logger} from '@babylonjs/core';
import {IProps} from '.';
import {useWindowDimensions} from 'react-native';

const GLRenderer = ({onCreateEngine}: IProps) => {
  Logger.LogLevels = Logger.NoneLogLevel;

  const engineRef = useRef<Engine>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {width, height} = useWindowDimensions();

  const [lastPixelRatio, setNewPixelRatio] = useState(window.devicePixelRatio);

  const handleResize = useCallback(() => {
    if (engineRef.current) {
      (canvasRef.current as HTMLCanvasElement).width = width;
      (canvasRef.current as HTMLCanvasElement).height = height;
      (canvasRef.current as HTMLCanvasElement).style.width = `100%`;
      (canvasRef.current as HTMLCanvasElement).style.height = `100%`;

      engineRef.current.setSize(width, height);
      engineRef.current.resize();

      if (lastPixelRatio != window.devicePixelRatio) setNewPixelRatio(window.devicePixelRatio);
    }
  }, [engineRef, width, height]);

  useEffect(() => {
    handleResize();
  }, [handleResize]);

  useEffect(() => {
    if (canvasRef.current) {
      const logFunc = console.log;
      console.log = () => true;

      engineRef.current = new Engine(canvasRef.current, true, {
        antialias: true,
        adaptToDeviceRatio: true,
        powerPreference: 'high-performance',
      });

      engineRef.current.doNotHandleContextLost = true;
      handleResize();

      Logger.ClearLogCache();

      console.log = logFunc;
      onCreateEngine(engineRef.current);
    }

    return () => {
      engineRef.current?.dispose();
    };
  }, [canvasRef, onCreateEngine, devicePixelRatio]);

  return <canvas ref={canvasRef} />;
};

export default memo(GLRenderer);
