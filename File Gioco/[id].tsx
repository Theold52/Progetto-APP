          team.players.map((p) => {
            const injured = p.injuredUntil && p.injuredUntil >= league.currentMatchday;
            return (
              <Pressable
                key={p.id}
                testID={`player-row-${p.id}`}
                onPress={() => router.push(`/player/${team.id}/${p.id}`)}
                onLongPress={() => deletePlayer(team.id, p.id)}
                style={styles.playerRow}
              >
                {p.photoUri ? (
                  <ExpoImage source={{ uri: p.photoUri }} style={styles.avatar} contentFit="cover" />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Text style={{ color: colors.brandPrimary, fontWeight: "800" }}>
                      {p.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <Text style={styles.playerName}>{p.name}</Text>
                    {p.age !== undefined && (
                      <View style={styles.ageBadge}>
                        <Text style={styles.ageBadgeText}>
                          {p.age} {t("ageYears")}
                        </Text>
                      </View>
                    )}
                    {injured && (
                      <View style={styles.injuryBadge}>
                        <Text style={styles.injuryBadgeText}>🚑 {t("injured")}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.playerStats}>
                    <StatPill label="⚽" val={p.goalPower} color={colors.brandPrimary} />
                    <StatPill label="🅰" val={p.assistPower} color={colors.brandSecondary} />
                    <StatPill label="🟥" val={p.foulPower} color={colors.error} />
                  </View>
                </View>
                <Text style={{ color: colors.muted, fontSize: 20 }}>›</Text>
              </Pressable>
            );
          })