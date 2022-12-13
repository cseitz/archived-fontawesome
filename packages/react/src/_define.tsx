import React, { createContext, useContext } from 'react';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import tFA from "@fortawesome/fontawesome-common-types";
import type { FC } from 'react';

const installed = JSON.parse(`$INSTALLED_ICON_LIBRARIES$`)
export function _installed(key: string) {
    return installed.includes(key);
}

type FontawsesomeIconImport = {
    definition: tFA.IconDefinition,
    prefix: tFA.IconPrefix,
    iconName: tFA.IconName,
    width: number,
    height: number,
    ligatures: (string | number)[],
    unicode: string,
    svgPathData: string,
    aliases: (string | number)[],
}

export type IconStyle = 'solid' | 'regular' | 'light' | 'thin' | 'duotone' | 'brand';

export type IconProps<Styles extends any = IconStyle> = Omit<FontAwesomeIconProps, 'icon' | 'style'> & {
    style?: Styles;
    sx?: FontAwesomeIconProps['style'];
};

export type Icon<Styles = IconStyle> = FC<IconProps<Styles>> & {
    // @ts-ignore
    [P in Styles]: FontawsesomeIconImport
};

export const IconContext = createContext<Partial<IconProps>>({
    style: 'regular'
});

export type IconDefinition = {
    name: string;
    label: string;
    search: {
        terms: string[]
    },
    styles: string[];
    unicode: string;
    changes: string[];
    faName: string;
    imports?: any[];
    [key: string]: any;
}


const DEFAULT_STYLE = 'regular';

export function _defineIcon<D extends IconDefinition, I extends Record<string, any>>(def: D, styles: I): Icon<keyof I> {
    return Object.assign(function (props) {
        const ctx = useContext(IconContext);
        const {
            style = ctx?.style || DEFAULT_STYLE,
            sx = {},
            ...rest
        } = props;
        const _style = style in styles ? style : Object.keys(styles)[0];
        let svg = styles[_style];
        if (!svg) {
            throw new Error(`Missing icon pack! Please install '@cseitz/fontawesome-svg-${_style}' to use ${_style}:${def.name}`);
        } else if (svg instanceof Error) {
            throw svg;
        }
        return <FontAwesomeIcon style={sx} icon={svg?.definition} {...rest} />
    }, styles);
}

export const _tryRequire = (name, found) => {
    try {
        const found = require(name);
        if (found) return found;
    } catch(err) {}
    return new Error("Missing icon pack! Please install '" + name.split('/').slice(0, 2) + "'");
};


