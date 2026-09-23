            <TextInput
              testID="team-name-input"
              value={name}
              onChangeText={setName}
              placeholder="Milano FC"
              placeholderTextColor={colors.muted}
              style={styles.input}
              autoFocus
            />
            {name.trim().length > 0 && isTeamNameBanned(name) && (
              <Text style={{ fontSize: 12, color: colors.error, fontWeight: "700", marginTop: 4 }}>
                ⚠ {t("banned")}
              </Text>
            )}