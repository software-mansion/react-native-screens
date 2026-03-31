        {/* <Text>Switch between direction options and check tab bahvior.</Text> */}
        <Text style={{ fontWeight: '700' }}>Config 1: {'\n'}System settings set to ltr language ie. English</Text>
        <Text>{'\n'} a. forceRTL: false, allowRTL: true. Restart app.</Text>
        <Text>{'\n'}Expected:</Text>
        <Text>- inherit - tabs order from left side: Config, Tab2</Text>
        <Text>- ltr - tabs order from left side: Config, Tab2</Text>
        <Text>- rtl - tabs order from right side: Config, Tab2</Text>
        <Text>{'\n'}b. forceRTL: true, allowRTL:true. Restart app. </Text>
        <Text>{'\n'}Expected:</Text>
        <Text>- inherit - tabs order from right side: Config, Tab2</Text>
        <Text>- ltr - tabs order from left side: Config, Tab2</Text>
        <Text>- rtl - tabs order from right side: Config, Tab2</Text>
        <Text style={{ fontWeight: '700' }}>{'\n'}Config 2: {'\n'}System settings set to rtl language ie. Arabic</Text>
        <Text>{'\n'} a. forceRTL: false, allowRTL: true. Restart app.</Text>
        <Text>{'\n'}Expected:</Text>
        <Text>- inherit - tabs order from right side: Config, Tab2</Text>
        <Text>- ltr - tabs order from left side: Config, Tab2</Text>
        <Text>- rtl - tabs order from right side: Config, Tab2</Text>
        <Text>{'\n'}b. forceRTL: true, allowRTL:true. Restart app. </Text>
        <Text>{'\n'}Expected:</Text>
        <Text>- inherit - tabs order from right side: Config, Tab2</Text>
        <Text>- ltr - tabs order from left side: Config, Tab2</Text>
        <Text>- rtl - tabs order from right side: Config, Tab2</Text>
