# 地址: https://github.com/Wans-OS/my-backup
# 作者: Wans
# 更新: 2026-04-29 19:38:17
# 描述: 在proxy-providers加入您的机场订阅链接 (代理提供者)

# 订阅锚点，排除了一些节点，例如 包含剩余, 官网, 到期, 也可以在exclude-filter添加你需要排除的节点
FilterPP: &FilterPP "Expire|到期|剩余|Traffic|网址|官网|过期|地址"

# 测速地址
# YouTube
# https://www.youtube.com/generate_204
# Google
# https://www.gstatic.com/generate_204
# https://www.google.com/generate_204
# https://www.google.cn/generate_204
# Cloudflare
# https://cp.cloudflare.com/generate_204
# https://www.qualcomm.cn/generate_204
UrlTest:  &UrlTest 'https://www.gstatic.com/generate_204'

PU: &PU { exclude-filter: *FilterPP, type: http, proxy: DIRECT, interval: 86400, health-check: { enable: true, url: *UrlTest, interval: 300 } }
# 官方配置文档: https://wiki.metacubex.one/config/proxy-providers/
proxy-providers:
  main:
    <<: *PU
    url: 
    path: ./proxy_provider/main.yaml
    header:
      User-Agent:
        - "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
    override:
      udp: true
  # home 同样通过 URL 获取订阅。所有 home 节点通过“前置代理”连接，
  # 最终访问目标看到的是 home 节点的出口 IP。
  home:
    <<: *PU
    url: 
    path: ./proxy_provider/home.yaml
    override:
      udp: true
      dialer-proxy: 前置代理
      additional-prefix: "落地-"

# 通用配置
mode: rule
ipv6: false
mixed-port: 7890
allow-lan: true
bind-address: '*'
log-level: warning
unified-delay: true
find-process-mode: strict
tcp-concurrent: true
keep-alive-interval: 15
keep-alive-idle: 600


# 规则选择缓存
profile:
  store-selected: true
  store-fake-ip: true
  tracing: true

# DNS配置
dns:
  enable: true
  ipv6: true
  prefer-h3: false
  use-hosts: true
  listen: 0.0.0.0:1053
  use-system-hosts: true
  respect-rules: true
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  fake-ip-range6: fdfe:dcba:9876::/64
  fake-ip-filter:
    - RULE-SET:Lan
    - RULE-SET:China
  fallback:
    - https://dns.adguard-dns.com/dns-query#ecs=1.1.1.1/24&ecs-override=true
    - https://dns.cloudflare.com/dns-query#ecs=1.1.1.1/24&ecs-override=true
    - https://dns.google/dns-query#ecs=1.1.1.1/24&ecs-override=true
  direct-nameserver-follow-policy: true # 用于 direct 出口域名解析的 DNS 服务器，如果不填则遵循 nameserver-policy、nameserver 和 fallback 的配置
  default-nameserver: # 默认 DNS, 用于解析 DNS 服务器 的域名，必须为 IP, 可为加密 DNS
    - tls://223.5.5.5
    - tls://119.29.29.29
  nameserver: # 默认的域名解析服务器，如不配置 fallback/proxy-server-nameserver , 则所有域名都由 nameserver 解析
    - https://dns.adguard-dns.com/dns-query#ecs=1.1.1.1/24&ecs-override=true
    - https://dns.cloudflare.com/dns-query#ecs=1.1.1.1/24&ecs-override=true
    - https://dns.google/dns-query#ecs=1.1.1.1/24&ecs-override=true
  nameserver-policy: # 指定域名查询的解析服务器，优先于 nameserver/fallback 查询
    "RULE-SET:China,Lan": 
      - https://dns.alidns.com/dns-query#ecs=223.5.5.5/24&ecs-override=true
      - https://doh.pub/dns-query#ecs=223.5.5.5/24&ecs-override=true
  proxy-server-nameserver:  # 代理节点域名解析服务器，仅用于解析代理节点的域名，如果不填则遵循 nameserver-policy、nameserver 和 fallback 的配置
    - https://dns.alidns.com/dns-query#ecs=223.5.5.5/24&ecs-override=true
    - https://doh.pub/dns-query#ecs=223.5.5.5/24&ecs-override=true
  proxy-server-nameserver-policy: # 格式同nameserver-policy，仅用于节点域名解析，优先于proxy-server-nameserver查询，自定义机场在此添加DNS
    '*.digital-nvme.com': 
      - 8.138.94.132:8053
    '*.yunsmartdns.com': 
      - 8.138.94.132:8053


# GEO配置
geodata-mode: false
geo-auto-update: true
geo-update-interval: 24
geodata-loader: memconservative
geox-url:
  geoip: "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geoip.dat"
  mmdb: "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/country.mmdb"
  geosite: "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geosite.dat"
  asn: "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/GeoLite2-ASN.mmdb"

# 入站
tun:
  enable: false
  stack: mixed
  auto-route: true
  auto-redirect: true
  auto-detect-interface: true
  dns-hijack: [ any:53, tcp://any:53 ]

# 嗅探
sniffer:
  enable: true
  parse-pure-ip: true
  override-destination: true
  sniff:
    TLS:
      ports: [ 443, 8443 ]
    HTTP:
      ports: [ 80, 8080-8880 ]
      override-destination: true
    QUIC:
      ports: [ 443, 8443 ]
  skip-domain:
     - "Mijia Cloud"
     - "+.push.apple.com"

# 实验性功能
experimental:
  quic-go-disable-gso: true
  sniff-tls-sni: true

# 面板设置
external-ui-name: zashboard
external-ui: ui
external-ui-url: https://github.com/Zephyruso/zashboard/releases/latest/download/dist.zip
secret: Wans
external-controller: '0.0.0.0:9090'

# 代理节点: 可以将自己的节点放在这里
# proxies:
#   - name: "[SS] domain"
#     type: ss
#     server: abaosd.jasidofnbasdfij.com
#     port: 443
#     cipher: chacha20-ietf-poly1305
#     password: 4nggcF
#     udp: true

# 节点筛选锚点
FilterHK: &FilterHK "(?i)(?=.*(🇭🇰|香港|港|hk|hkg|hong ?kong))"
FilterTW: &FilterTW "(?i)(?=.*(🇹🇼|台湾|台|TW|TWN|taiwan|taipei))"
FilterSG: &FilterSG "(?i)(?=.*(🇸🇬|新加坡|狮城|新|SG|SGP|singapore))"
FilterJP: &FilterJP "(?i)(?=.*(🇯🇵|日本|日|JP|JPN|japan|tokyo|osaka))"
FilterKR: &FilterKR "(?i)(?=.*(🇰🇷|韩国|韩|KR|KOR|korea|seoul))"
FilterUS: &FilterUS "(?i)(?=.*(🇺🇸|美国|美|US|USA|united ?states|america|los angeles|san jose|silicon valley))"
FilterUK: &FilterUK "(?i)(?=.*(🇬🇧|英国|英|GBR|UK|united ?kingdom|london))"
FilterHM: &FilterHM "(?i)(?=.*(家宽))"

# 代理组地区配置锚点
# 明确限定 use: [ main ]，避免家宽落地节点混入机场地区测速组。
BaseUT: &BaseUT { interval: 300, lazy: true, url: *UrlTest, hidden: true, type: url-test, use: [ main ] }

# 常用策略组锚点
# “普通出口”仅使用 main 订阅；“家宽落地”仅使用 home 订阅并通过“前置代理”建立链路。
# 每个规则集策略组都可以独立选择普通出口或家宽落地，不受“手动选择”的当前选项限制。
SelectUL: &SelectUL { type: select, use: [ main ], proxies: [ 家宽落地, 香港自动, 台湾自动, 狮城自动, 日本自动, 韩国自动, 美国自动, 英国自动, DIRECT, REJECT ] }
SelectTW: &SelectTW { type: select, proxies: [ 台湾自动, 普通出口, 家宽落地, 手动选择, 香港自动, 狮城自动, 日本自动, 韩国自动, 美国自动, 英国自动, DIRECT, REJECT ] }
SelectUS: &SelectUS { type: select, proxies: [ 美国自动, 普通出口, 家宽落地, 手动选择, 香港自动, 台湾自动, 狮城自动, 日本自动, 韩国自动, 英国自动, DIRECT, REJECT ] }
SelectSG: &SelectSG { type: select, proxies: [ 狮城自动, 普通出口, 家宽落地, 手动选择, 香港自动, 台湾自动, 日本自动, 韩国自动, 美国自动, 英国自动, DIRECT, REJECT ] }
SelectSL: &SelectSL { type: select, proxies: [ 普通出口, 家宽落地, 手动选择, 香港自动, 台湾自动, 狮城自动, 日本自动, 韩国自动, 美国自动, 英国自动, DIRECT, REJECT ] }
SelectDR: &SelectDR { type: select, proxies: [ DIRECT, 普通出口, 家宽落地, 手动选择, 香港自动, 台湾自动, 狮城自动, 日本自动, 韩国自动, 美国自动, 英国自动, REJECT ] }

# 代理组
proxy-groups:
  # ===================== 总入口与链式代理 =====================
  # 普通模式：在“手动选择”中选机场节点或地区自动组。
  # 落地模式：在“手动选择”中选“家宽落地”，并在“前置代理”选择入口机场节点。
  - { name: 手动选择,     <<: *SelectUL, icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Rocket.png }
  # 普通出口只读取 main 机场订阅。规则集选它时，不会经过 home 家宽节点。
  - { name: 普通出口,     type: select, use: [ main ], proxies: [ 香港自动, 台湾自动, 狮城自动, 日本自动, 韩国自动, 美国自动, 英国自动, DIRECT, REJECT ], icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Proxy.png }
  - { name: 前置代理,     type: select, use: [ main ], proxies: [ 香港自动, 台湾自动, 狮城自动, 日本自动, 韩国自动, 美国自动, 英国自动, DIRECT ], icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Proxy.png }
  - { name: 家宽落地,     type: select, use: [ home ], icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Home.png }
  - { name: GLOBAL,       <<: *SelectSL, icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Global.png }

  # 原始规则中使用了这两个组，补齐定义以避免配置加载失败。
  - { name: mt选择,       <<: *SelectSL, icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Final.png }
  - { name: 动态选择,     <<: *SelectSL, icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Final.png }

  # ===================== AI大模型 =====================
  - { name: Claude,       <<: *SelectTW, icon: https://fastly.jsdelivr.net/gh/lobehub/lobe-icons@master/packages/static-png/light/claude-color.png }
  - { name: Gemini,       <<: *SelectSG, icon: https://fastly.jsdelivr.net/gh/lobehub/lobe-icons@master/packages/static-png/light/gemini-color.png, url: "https://www.google.com/generate_204" }
  - { name: OpenAI,       <<: *SelectUS, icon: https://fastly.jsdelivr.net/gh/lobehub/lobe-icons@master/packages/static-png/light/openai.png }

  # ===================== 媒体 & 娱乐 =====================
  - { name: Apple,        <<: *SelectSL, icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Apple.png, url: "https://www.apple.com/library/test/success.html" }
  - { name: Disney,       <<: *SelectSL, icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Disney.png }
  - { name: Netflix,      <<: *SelectSL, icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Netflix.png }
  - { name: Spotify,      <<: *SelectSL, icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Spotify.png }
  - { name: TikTok,       <<: *SelectTW, icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/TikTok.png }
  - { name: YouTube,      <<: *SelectSL, icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/YouTube.png, url: "https://www.youtube.com/generate_204" }

  # ===================== 生产力 & 常用 =====================
  - { name: Emby,         <<: *SelectSL, icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Emby.png }
  - { name: Github,       <<: *SelectSL, icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/GitHub.png }
  - { name: Google,       <<: *SelectSL, icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Google_Search.png, url: "https://www.google.com/generate_204" }
  - { name: Microsoft,    <<: *SelectDR, icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Microsoft.png, url: "http://www.msftconnecttest.com/connecttest.txt" }
  - { name: OneDrive,     <<: *SelectSL, icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/OneDrive.png }

  # ===================== 社交 & 即时通讯 =====================
  - { name: Twitter(X),   <<: *SelectSL, icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Twitter(X).png }
  - { name: Telegram,     <<: *SelectSL, icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Telegram.png }
  - { name: WhatsApp,     <<: *SelectSL, icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/WhatsApp.png }

  # ===================== 游戏 & 下载 =====================
  - { name: Steam,        <<: *SelectSL, icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Steam.png }

  # ===================== 地区分组：仅保留自动测速 =====================
  - { name: 香港自动,     <<: *BaseUT, filter: *FilterHK, icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Hong_Kong.png }
  - { name: 台湾自动,     <<: *BaseUT, filter: *FilterTW, icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Taiwan.png }
  - { name: 狮城自动,     <<: *BaseUT, filter: *FilterSG, icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Singapore.png }
  - { name: 日本自动,     <<: *BaseUT, filter: *FilterJP, icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Japan.png }
  - { name: 韩国自动,     <<: *BaseUT, filter: *FilterKR, icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/Korea.png }
  - { name: 美国自动,     <<: *BaseUT, filter: *FilterUS, icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/United_States.png }
  - { name: 英国自动,     <<: *BaseUT, filter: *FilterUK, icon: https://fastly.jsdelivr.net/gh/0xWans/Qure@master/IconSet/Color/United_Kingdom.png }

# 规则锚点
rule-anchor:
  # 规则集锚点
  BehaviorDN: &BehaviorDN {type: http, interval: 86400, proxy: DIRECT, format: mrs,  behavior: domain }
  BehaviorIP: &BehaviorIP {type: http, interval: 86400, proxy: DIRECT, format: mrs,  behavior: ipcidr }
  BehaviorCL: &BehaviorCL {type: http, interval: 86400, proxy: DIRECT, format: yaml, behavior: classical }

# 规则集配置
rule-providers:
  # 域名规则集
  category-ads-all: { <<: *BehaviorDN, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/category-ads-all.mrs }
  Apple:            { <<: *BehaviorDN, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/apple@cn.mrs }
  China:            { <<: *BehaviorDN, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/cn.mrs }
  Claude:           { <<: *BehaviorDN, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/anthropic.mrs }
  Disney:           { <<: *BehaviorDN, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/disney.mrs }
  Emby:             { <<: *BehaviorDN, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/category-emby.mrs }
  Gemini:           { <<: *BehaviorDN, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/google-gemini.mrs }
  Github:           { <<: *BehaviorDN, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/github.mrs }
  Google:           { <<: *BehaviorDN, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/google.mrs }
  Lan:              { <<: *BehaviorDN, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/private.mrs }
  Microsoft:        { <<: *BehaviorDN, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/microsoft.mrs  }
  Netflix:          { <<: *BehaviorDN, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/netflix.mrs }
  OpenAI:           { <<: *BehaviorDN, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/openai.mrs }
  OneDrive:         { <<: *BehaviorDN, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/onedrive.mrs }
  Steam:            { <<: *BehaviorDN, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/steam.mrs }
  Spotify:          { <<: *BehaviorDN, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/spotify.mrs }
  TikTok:           { <<: *BehaviorDN, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/tiktok.mrs }
  WhatsApp:         { <<: *BehaviorDN, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/whatsapp.mrs }
  Twitter:          { <<: *BehaviorDN, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/x.mrs }
  Telegram:         { <<: *BehaviorDN, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/telegram.mrs }
  YouTube:          { <<: *BehaviorDN, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/youtube.mrs }
  DNSLeak:          { <<: *BehaviorDN, url: https://fastly.jsdelivr.net/gh/0xWans/my-backup@main/clash/rules/DNSLeak.mrs }

  # IP规则集
  ChinaIP:          { <<: *BehaviorIP, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geoip/cn.mrs }
  GoogleIP:         { <<: *BehaviorIP, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geoip/google.mrs }
  LanIP:            { <<: *BehaviorIP, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geoip/private.mrs }
  NetflixIP:        { <<: *BehaviorIP, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geoip/netflix.mrs }
  TwitterIP:        { <<: *BehaviorIP, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geoip/twitter.mrs }
  TelegramIP:       { <<: *BehaviorIP, url: https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geoip/telegram.mrs }

  # 应用规则集
  ChinaAPP:       { <<: *BehaviorCL, url: https://fastly.jsdelivr.net/gh/0xWans/my-backup@main/clash/rules/Process/ChinaAPP.yaml }
  Direct:         { <<: *BehaviorDN, url: https://fastly.jsdelivr.net/gh/0xWans/my-backup@main/clash/rules/Direct.mrs }

# 官方配置文档: https://wiki.metacubex.one/config/rules/
rules:
  # 自定义规则集
  - DOMAIN,uspve.vovovo.eu.org,手动选择
  - DOMAIN,ssh.vovovo.eu.org,手动选择
  - DOMAIN,rdp.vovovo.eu.org,手动选择  
  - DOMAIN-KEYWORD,linkcube,DIRECT
  - DOMAIN,nb.vovovo.top,DIRECT
  - DOMAIN-KEYWORD,metatrader4,mt选择
  - DOMAIN-KEYWORD,metatrader5,mt选择
  - DOMAIN-KEYWORD,exness,mt选择
  - DOMAIN,ping.vovovo.eu.org,DIRECT
  - DOMAIN-SUFFIX,civitai.com,手动选择
  - DOMAIN-SUFFIX,msftconnecttest.com,手动选择
  - DOMAIN-SUFFIX,vovovo.eu.org,DIRECT
  - DOMAIN-SUFFIX,v2ex.com,手动选择
  - DOMAIN-KEYWORD,netbird,手动选择
  - DOMAIN-SUFFIX,free-proxy.cz,手动选择
  - DOMAIN-SUFFIX,idc.wiki,手动选择
  - DOMAIN-SUFFIX,hetzner.com,DIRECT
  - DOMAIN-SUFFIX,servercontrolpanel.de,DIRECT
  - DOMAIN-SUFFIX,customercontrolpanel.de,DIRECT  
  - DOMAIN-SUFFIX,netcup.eu,DIRECT  
  - DOMAIN-SUFFIX,netcup.com,DIRECT
  - DOMAIN-SUFFIX,hostloc.com,手动选择
  - DOMAIN-SUFFIX,spartanhost.net,DIRECT
  - DOMAIN-SUFFIX,olink.cloud,DIRECT
  - DOMAIN-SUFFIX,usbx.me,DIRECT
  - DOMAIN-SUFFIX,your-storagebox.de,动态选择
  - DOMAIN-SUFFIX,mypikpak.com,手动选择
  - DOMAIN-SUFFIX,jd.com,DIRECT
  - DOMAIN-SUFFIX,epicgames.com,DIRECT
  - IP-CIDR,172.105.236.102/24,手动选择
  - DOMAIN-SUFFIX,teacher.com.cn,DIRECT
  - DOMAIN-SUFFIX,idc.best,DIRECT
  - DOMAIN-SUFFIX,acl4.ssr,DIRECT
  - DOMAIN-SUFFIX,duyaoss.com,手动选择
  - RULE-SET,Direct,DIRECT
  - AND,((DST-PORT,443),(NETWORK,UDP),(NOT,((RULE-SET,ChinaIP))),(NOT,((RULE-SET,China)))),REJECT  # 阻止海外 QUIC 流量泄漏
  
  # 应用规则集
  - RULE-SET,ChinaAPP,DIRECT  

  # 域名规则集-按照优先级顺序排列
  - RULE-SET,category-ads-all,REJECT
  - RULE-SET,YouTube,YouTube
  - RULE-SET,Github,Github
  - RULE-SET,OpenAI,OpenAI
  - RULE-SET,Gemini,Gemini
  - RULE-SET,Google,Google
  - RULE-SET,Apple,Apple
  - RULE-SET,Claude,Claude
  - RULE-SET,Twitter,Twitter(X)
  - RULE-SET,Telegram,Telegram
  - RULE-SET,Spotify,Spotify
  - RULE-SET,TikTok,TikTok
  - RULE-SET,WhatsApp,WhatsApp
  - RULE-SET,OneDrive,OneDrive
  - RULE-SET,Microsoft,Microsoft
  - RULE-SET,Netflix,Netflix
  - RULE-SET,Disney,Disney
  - RULE-SET,Steam,Steam
  - RULE-SET,Emby,Emby
  - RULE-SET,Lan,DIRECT
  - RULE-SET,China,DIRECT

  # IP规则集-按照优先级顺序排列
  - RULE-SET,LanIP,DIRECT,no-resolve
  - RULE-SET,ChinaIP,DIRECT,no-resolve
  - RULE-SET,GoogleIP,Google,no-resolve
  - RULE-SET,TelegramIP,Telegram,no-resolve
  - RULE-SET,TwitterIP,Twitter(X),no-resolve

  # 默认规则集
  - MATCH,手动选择
