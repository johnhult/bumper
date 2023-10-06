'use client';
import * as React from 'react';

const SettingsContext = React.createContext<SettingsContextType | null>(null);

type SettingsContextType = {
  settings: SettingsType;
  setColor: (c: SettingsType['color']) => void;
};

type SettingsType = {
  color: (typeof choicesSettings.color)[number];
  name: string;
  hp: number;
};

export const defaultSettings: SettingsType = {
  color: '#ffa822',
  name: 'Player',
  hp: 5,
};

export const choicesSettings = {
  color: ['#ffa822', '#134e6f', '#ff6150', '#1ac0c6', '#dee0e6'] as const,
};

enum ActionTypes {
  UPDATE_SETTING = 'update-setting',
  RESET_TO_DEFAULT = 'reset-to-default',
}

type StringSettingPayload = {
  setting: keyof Pick<SettingsType, 'color' | 'name'>;
  value: string;
};
type NumberSettingPayload = {
  setting: keyof Pick<SettingsType, 'hp'>;
  value: number;
};

type Actions =
  | {
      type: ActionTypes.UPDATE_SETTING;
      payload: StringSettingPayload | NumberSettingPayload;
    }
  | { type: ActionTypes.RESET_TO_DEFAULT };

function settingsReducer(settings: SettingsType, action: Actions) {
  const { type } = action;
  switch (type) {
    case ActionTypes.UPDATE_SETTING:
      const { payload } = action;
      return { ...settings, [payload.setting]: payload.value };
    case ActionTypes.RESET_TO_DEFAULT:
      return { ...defaultSettings };
  }
}

export default function SettingsProvider({
  children,
}: React.PropsWithChildren) {
  const [settings, dispatch] = React.useReducer(
    settingsReducer,
    defaultSettings
  );

  function setColor(c: SettingsType['color']) {
    dispatch({
      type: ActionTypes.UPDATE_SETTING,
      payload: { setting: 'color', value: c },
    });
  }

  function setName(n: string) {
    dispatch({
      type: ActionTypes.UPDATE_SETTING,
      payload: { setting: 'name', value: n },
    });
  }

  const val = {
    settings,
    setColor,
    setName,
  };

  return (
    <SettingsContext.Provider value={val}>{children}</SettingsContext.Provider>
  );
}

export function useSetColor() {
  const context = React.useContext(SettingsContext);
  if (!context) {
    throw new Error("Can't use context outside context boundaries");
  }
  return context.setColor;
}

export function useGetSettings() {
  const context = React.useContext(SettingsContext);
  if (!context) {
    throw new Error("Can't use context outside context boundaries");
  }
  return context.settings;
}
