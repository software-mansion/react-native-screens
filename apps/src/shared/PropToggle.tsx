import React from 'react';
import { View, Pressable, Text, Platform, TouchableOpacity, StyleSheet, ViewStyle, ScrollView } from 'react-native';

type Props = {
    label: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    style?: ViewStyle;
    testID?: string;
    note?: string;
    iosOnly: boolean;
};

type PropsSelector<T extends string> = {
    label: string;
    options: T[];
    selected: T;
    testIDPrefix: string;
    onValueChange: (value: T) => void;
    iosOnly?: boolean;
    note?: string;
};

export const PropToggle = ({
    label,
    value,
    onValueChange,
    style = {},
    testID,
    iosOnly,
    note,
}: Props): React.JSX.Element => {

    return (
        <View style={ctrl.group}>
            <View style={ctrl.row}>
                <View style={ctrl.labelRow}>
                    <Text style={ctrl.label}>{label}</Text>
                    {iosOnly && <Text style={ctrl.badge}>iOS only</Text>}
                </View>
                <TouchableOpacity
                    onPress={() => onValueChange(!value)}
                    testID={testID}
                    style={[ctrl.chip, value && ctrl.chipActive]}>
                    <Text style={[ctrl.chipText, value && ctrl.chipTextActive]}>
                        {value ? 'ON' : 'OFF'}
                    </Text>
                </TouchableOpacity>
            </View>
            {note ? <Text style={ctrl.note}>{note}</Text> : null}
        </View>
    );
};


export const PropSelector = <T extends string>({
    label,
    options,
    selected,
    testIDPrefix,
    onValueChange,
    iosOnly,
    note,
}: PropsSelector<T>): React.JSX.Element => {

    return (
        <View style={ctrl.group}>
            <View style={ctrl.row}>
                <View style={ctrl.labelRow}>
                    <Text style={ctrl.label}>{label}</Text>
                    {iosOnly && <Text style={ctrl.badge}>iOS only</Text>}
                </View>
            </View>
            
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={ctrl.scrollContainer}
            >
                {options.map((option) => {
                    const isActive = option === selected;
                    return (
                        <Pressable
                            key={option}
                            // testID dla aktywnego elementu lub specyficzny dla opcji
                            testID={isActive ? `${testIDPrefix}-active` : `${testIDPrefix}-${option}`}
                            onPress={() => onValueChange(option)}
                            style={[ctrl.chip, isActive && ctrl.chipActive]}
                        >
                            <Text style={[ctrl.chipText, isActive && ctrl.chipTextActive]}>
                                {option}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
            
            {note ? <Text style={ctrl.note}>{note}</Text> : null}
        </View>
    );
};


const ctrl = StyleSheet.create({
    panel: {
        marginTop: 24,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingTop: 16,
        gap: 12,
    },
    heading: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        color: '#888',
        letterSpacing: 0.5,
    },
    group: {
        gap: 6,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 13,
        color: '#555',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    chip: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: 6,
    },
    chipActive: {
        borderColor: '#007AFF',
        backgroundColor: '#007AFF',
    },
    chipText: {
        fontSize: 12,
        color: '#555',
    },
    chipTextActive: {
        color: '#fff',
    },
    note: {
        fontSize: 12,
        color: '#888',
        fontStyle: 'italic',
    },
    log: {
        marginTop: 8,
        gap: 4,
    },
    logScroll: {
        maxHeight: 120,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 6,
        padding: 8,
    },
    logEmpty: {
        fontSize: 12,
        color: '#aaa',
        fontStyle: 'italic',
    },
    logEntry: {
        fontSize: 11,
        color: '#333',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        lineHeight: 18,
    },
});