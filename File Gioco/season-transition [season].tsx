          {transfers.length === 0 ? (
            <View style={styles.card}>
              <Text style={styles.emptyText}>🤝 {t("noTransfers")}</Text>
              <Text style={styles.emptySub}>
                Nessuno ha voluto lasciare il proprio club questa estate.
              </Text>
            </View>
          ) : (
            transfers.map((tr, i) => (
              <View key={i} style={styles.transferRow} testID={`transfer-${i}`}>
                <View style={styles.transferBadge}>
                  <Text style={styles.transferBadgeText}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.playerName}>⚽ {tr.playerName}</Text>
                  <View style={styles.arrow}>
                    <Text style={styles.arrowFrom} numberOfLines={1}>
                      {tr.fromTeamName}
                    </Text>
                    <Text style={styles.arrowIcon}>➔</Text>
                    <Text style={styles.arrowTo} numberOfLines={1}>
                      {tr.toTeamName}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}

          {/* Retirements */}
          <View style={{ height: 24 }} />
          <View style={styles.divider} />
          <Text style={styles.count}>
            👋 {retirements.length} {t("retirements").toUpperCase()}
          </Text>
          <View style={styles.divider} />
          <View style={{ height: 12 }} />
          {retirements.length === 0 ? (
            <View style={styles.card}>
              <Text style={styles.emptyText}>{t("noRetirements")}</Text>
            </View>
          ) : (
            retirements.map((r, i) => (
              <View key={i} style={styles.retireRow} testID={`retire-${i}`}>
                <Text style={styles.retireIcon}>🎩</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.playerName}>{r.playerName}</Text>
                  <Text style={styles.arrowFrom} numberOfLines={1}>
                    {r.teamName} · {r.age} {t("ageYears")}
                  </Text>
                </View>
              </View>
            ))
          )}

          {/* Rookies */}
          <View style={{ height: 24 }} />
          <View style={styles.divider} />
          <Text style={styles.count}>
            🌱 {rookies.length} {t("newRookies").toUpperCase()}
          </Text>
          <View style={styles.divider} />
          <View style={{ height: 12 }} />
          {rookies.length === 0 ? (
            <View style={styles.card}>
              <Text style={styles.emptyText}>{t("noRookies")}</Text>
            </View>
          ) : (
            rookies.map((r, i) => (
              <View key={i} style={styles.rookieRow} testID={`rookie-${i}`}>
                <Text style={styles.retireIcon}>⚡</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.playerName}>{r.playerName}</Text>
                  <Text style={styles.arrowTo} numberOfLines={1}>
                    {r.teamName}
                  </Text>
                </View>
              </View>
            ))
          )}