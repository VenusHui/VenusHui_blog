---
title: Leetcode第287场周赛题解
description: "比赛时间：2022/04/03 10:30-12:00，排名：2019/6811"
date: 2022/04/05
---

![](https://fc.dianhsu.top/lc?user=VenusHui&loc=cn&req=rating)

> 别问为什么第75场双周赛打的早题解却写的晚，问就是打的时候第四题看都没看qwq。
>
> 最近封校白天忙着打游戏，晚上忙着emo，没怎么写题，争取明后天把双周赛的题解肝出来（即把第四题做出来...）

## [Leetcode第287场周赛](https://leetcode-cn.com/contest/weekly-contest-287/)

### [第一题 转化时间需要的最少操作数](https://leetcode-cn.com/problems/minimum-number-of-operations-to-convert-time/)

#### 题目描述

给你两个字符串 `current` 和 `correct` ，表示两个 **24 小时制时间** 。

24 小时制时间 按 `"HH:MM"` 进行格式化，其中 `HH` 在 `00` 和 `23` 之间，而 `MM` 在 `00` 和 `59` 之间。最早的 `24` 小时制时间为 `00:00` ，最晚的是 `23:59` 。

在一步操作中，你可以将 `current` 这个时间增加 `1`、`5`、`15` 或 `60` 分钟。你可以执行这一操作 **任意** 次数。

返回将 `current` 转化为 `correct` 需要的 **最少操作数** 。

#### 样例

```
输入：current = "02:30", correct = "04:35"
输出：3
```

#### 数据范围

```
current 和 correct 都符合 "HH:MM" 格式
current <= correct
```

#### 题目分析

由于是24小时制时间，数据范围有限，所以本题就是一道很常规的**模拟**。

具体的模拟思路如下：将题给的字符串转换为当前和目标时间的小时和分钟：
```cpp
int ch = (current[0] - '0') * 10 + (current[1] - '0') * 1;
int cm = (current[3] - '0') * 10 + (current[4] - '0') * 1;
int ah = (correct[0] - '0') * 10 + (correct[1] - '0') * 1;
int am = (correct[3] - '0') * 10 + (correct[4] - '0') * 1;
```
然后判断判断分钟数够不够减，如果够减则直接计算得出答案，否则需要向小时“借一位”，即加上60再计算。注意题目的数据范围中已经明确指出`current <= correct`，所以不用担心最后的答案为负的情况（虽然我的AC代码中对于这种情况直接又向上借位借了24小时，不会真的有人不读题吧不会吧不会吧不会吧...）。

#### 复杂度分析

由于数据范围有限，时间和空间复杂度均为 *O(1)*

### [第二题 找出输掉零场或一场比赛的玩家](https://leetcode-cn.com/problems/find-players-with-zero-or-one-losses/)

#### 题目描述

给你一个整数数组 `matches` 其中 `matches[i] = [winner[i], loser[i]]` 表示在一场比赛中 `winner[i]` 击败了 `loser[i]` 。

返回一个长度为 `2` 的列表 `answer` ：

`answer[0]` 是所有 **没有** 输掉任何比赛的玩家列表。
`answer[1]` 是所有恰好输掉 **一场** 比赛的玩家列表。
两个列表中的值都应该按 **递增** 顺序返回。

注意：

只考虑那些参与 **至少一场** 比赛的玩家。
生成的测试用例保证 **不存在** 两场比赛结果 **相同** 。

#### 样例

```
输入：matches = [[1,3],[2,3],[3,6],[5,6],[5,7],[4,5],[4,8],[4,9],[10,4],[10,9]]
输出：[[1,2,10],[4,5,7,8]]
解释：
玩家 1、2 和 10 都没有输掉任何比赛。
玩家 4、5、7 和 8 每个都输掉一场比赛。
玩家 3、6 和 9 每个都输掉两场比赛。
因此，answer[0] = [1,2,10] 和 answer[1] = [4,5,7,8] 。
```

#### 数据范围

```
1 <= matches.length <= 1e5
matches[i].length == 2
1 <= winner[i], loser[i] <= 1e5
winner[i] != loser[i]
所有 matches[i] 互不相同
```

#### 题目分析

按照题目要求，我们需要找到一场比赛都没有输的的玩家以及只输掉一场比赛的玩家，即我们需要统计所有玩家输的场次数量，则可以用`map<int, int>`记录，第一关键字为玩家的编号，第二关键字为该玩家输的场次数量。

此外，由于我们需要考虑的是那些至少参加了一场比赛的玩家，所以一场比赛都没有输的玩家一定会从有胜场的玩家中产生，相似的，我们同样用一个`map<int, int>`记录，第一关键字为玩家的编号，第二关键字为该玩家获胜的的场次数量。（其实这里只需要记录获胜玩家的编号即可，但中国人总会有一种对于对称的近乎狂热的追求哈哈哈哈）

```cpp
for (int i = 0; i < size; i++) {
    if (w.find(matches[i][0]) == w.end()) {
        w.insert(make_pair(matches[i][0], 1));
    }
    else {
        w.find(matches[i][0])->second++;
    }
    if (l.find(matches[i][1]) == l.end()) {
        l.insert(make_pair(matches[i][1], 1));
    }
    else {
        l.find(matches[i][1])->second++;
    }
}
```

查找全胜玩家，只需要遍历获胜玩家的列表，并查找每一位获胜玩家在失败玩家列表中的失败场次，若未找到则该玩家确实一场未输，加入答案。

```cpp
for (map<int, int>::iterator it = w.begin(); it != w.end(); it++) {
    if (l.find(it->first) == l.end()) {
        ans[0].push_back(it->first);
    }
}
```

查找只输了一场的玩家，只需要遍历失败玩家列表，失败场次为1则加入答案。

```cpp
for (map<int, int>::iterator it = l.begin(); it != l.end(); it++) {
    if (it->second == 1) {
        ans[1].push_back(it->first);
    }
}
```

#### 复杂度分析

- 时间复杂度：

  根据上述题目分析，整个代码分为三个部分：

  - 遍历整个数组的复杂度为 *O(n)* ，向`map`中插入元素的复杂度为 *O(logn)*，总的时间复杂度为 *O(nlogn)*。


  - 查找全胜玩家需要遍历获胜玩家列表，复杂度为 *O(n)*，并查找该玩家的失败场次，复杂度为 *O(logn)*，总的时间复杂度为 *O(nlogn)*。


  - 查找只输一场的玩家只需要遍历失败玩家列表，复杂度为 *O(n)*


综上所述，总的时间复杂度为 *O(nlogn)*。

### [第三题  每个小孩最多能分到多少糖果](https://leetcode-cn.com/problems/maximum-candies-allocated-to-k-children/)

#### 题目描述

给你一个 **下标从 0 开始** 的整数数组 `candies` 。数组中的每个元素表示大小为 `candies[i]` 的一堆糖果。你可以将每堆糖果分成任意数量的 **子堆** ，但 **无法** 再将两堆合并到一起。

另给你一个整数 `k` 。你需要将这些糖果分配给 `k` 个小孩，使每个小孩分到 相同 数量的糖果。每个小孩可以拿走 **至多一堆** 糖果，有些糖果可能会不被分配。

返回每个小孩可以拿走的 **最大糖果数目** 。

#### 样例

```
输入：candies = [5,8,6], k = 3
输出：5
解释：可以将 candies[1] 分成大小分别为 5 和 3 的两堆，然后把 candies[2] 分成大小分别为 5 和 1 的两堆。现在就有五堆大小分别为 5、5、3、5 和 1 的糖果。可以把 3 堆大小为 5 的糖果分给 3 个小孩。可以证明无法让每个小孩得到超过 5 颗糖果。
```

#### 数据范围

```
1 <= candies.length <= 1e5
1 <= candies[i] <= 1e7
1 <= k <= 1e12
```

#### 题目分析

二分战神曾经说，学会二分，cf 的rating至少能上2500（bushi

本题是一道非常经典的二分题目，由于每个小孩只能拿走至多一堆糖果，所以我们可以从`0`到一堆糖果的最大个数加一即`1e7 + 1`开始二分，即可得到答案。

二分的过程中只需要计算对于每个二分的值`x`，是否能够分出`k`堆糖果使得每堆的糖果数量为`x`，其实就是一个简单的除法：

```cpp
int m = (l + r) / 2;
long long num = 0;
for (int i = 0; i < size; i++) {
    num += candies[i] / m;
}
```

#### 复杂度分析

- 时间复杂度：二分过程的复杂度为 *O(logm)*，再计算是否符合要求时需要遍历整个糖果数组，复杂度为 *O(n)*，总的时间复杂度为 *O(nlogm)*，这里的`m`为一堆糖果的最大数目`1e7`

### [第四题 加密解密字符串](https://leetcode-cn.com/problems/encrypt-and-decrypt-strings/)

#### 题目描述
给你一个字符数组 `keys` ，由若干 **互不相同** 的字符组成。还有一个字符串数组 `values` ，内含若干长度为 `2` 的字符串。另给你一个字符串数组 `dictionary` ，包含解密后所有允许的原字符串。请你设计并实现一个支持加密及解密下标从 `0` 开始字符串的数据结构。

字符串 **加密** 按下述步骤进行：

对字符串中的每个字符 `c` ，先从 `keys` 中找出满足 `keys[i] == c` 的下标 `i` 。
在字符串中，用 `values[i]` 替换字符 `c` 。
字符串 **解密** 按下述步骤进行：

将字符串每相邻 `2` 个字符划分为一个子字符串，对于每个子字符串 `s` ，找出满足 `values[i] == s` 的一个下标 `i` 。如果存在多个有效的 `i` ，从中选择 **任意** 一个。这意味着一个字符串解密可能得到多个解密字符串。
在字符串中，用 `keys[i]` 替换 `s` 。
实现 `Encrypter` 类：

`Encrypter(char[] keys, String[] values, String[] dictionary)` 用 `keys`、`values` 和 `dictionary` 初始化 `Encrypter` 类。
`String encrypt(String word1)` 按上述加密过程完成对 `word1` 的加密，并返回加密后的字符串。
`int decrypt(String word2)` 统计并返回可以由 `word2` 解密得到且出现在 `dictionary` 中的字符串数目。

#### 样例

```
输入：
["Encrypter", "encrypt", "decrypt"]
[[['a', 'b', 'c', 'd'], ["ei", "zf", "ei", "am"], ["abcd", "acbd", "adbc", "badc", "dacb", "cadb", "cbda", "abad"]], ["abcd"], ["eizfeiam"]]

输出：
[null, "eizfeiam", 2]

解释：
Encrypter encrypter = new Encrypter([['a', 'b', 'c', 'd'], ["ei", "zf", "ei", "am"], ["abcd", "acbd", "adbc", "badc", "dacb", "cadb", "cbda", "abad"]);
encrypter.encrypt("abcd"); // 返回 "eizfeiam"。 
                           // 'a' 映射为 "ei"，'b' 映射为 "zf"，'c' 映射为 "ei"，'d' 映射为 "am"。
encrypter.decrypt("eizfeiam"); // return 2. 
                              // "ei" 可以映射为 'a' 或 'c'，"zf" 映射为 'b'，"am" 映射为 'd'。 
                              // 因此，解密后可以得到的字符串是 "abad"，"cbad"，"abcd" 和 "cbcd"。 
                              // 其中 2 个字符串，"abad" 和 "abcd"，在 dictionary 中出现，所以答案是 2 。
```

#### 数据范围

```
1 <= keys.length == values.length <= 26
values[i].length == 2
1 <= dictionary.length <= 100
1 <= dictionary[i].length <= 100
所有 keys[i] 和 dictionary[i] 互不相同
1 <= word1.length <= 2000
1 <= word2.length <= 200
所有 word1[i] 都出现在 keys 中
word2.length 是偶数
keys、values[i]、dictionary[i]、word1 和 word2 只含小写英文字母
至多调用 encrypt 和 decrypt 总计 200 次
```

#### 题目分析

先抛开难度不谈，单单这个题干长度就有点劝退那味了，但逐步拆解下来会发现这是一道很简单的题，深吸一口气我们现在开始：

首先题目想要我们实现一个类，作用是对给定的字符串进行加密以及解密：

- 将`word1`加密：由于数据范围中已经明确说明所有 `keys[i]` 互不相同所有 `word1[i]` 都出现在 `keys` 中，所以我们可以对于 `word1`中的每一位遍历 `keys` 找到相等的下标之后将对应的 `values` 添加到答案中即可。

```cpp
for (int i = 0; i < size; i++) {
    for (int j = 0; j < ksize; j++) {
        if (word1[i] == k[j]) {
            ans += v[j];
        }
    }
}
```

- 将`word2`解密：根据题目中描述的解密过程，每次解密的分步骤可能会出现多种情况，而最后得到的字符串是多种情况的叠加，所以可以使用 **字典树** 解决（等我学完字典树就回来更新字典树做法）。但其实并不用如此大动干戈，虽然解密到加密的方向会出现多种情况，但加密到解密的过程是唯一的啊！再加上我们要求的是最后得到的字符串在`dictionary`中的个数，所以可以直接遍历整个 `dictionary`，对其中的每一个字符串都加密之后与`word2`进行对比即可得到答案。

```cpp
for (int i = 0; i < dsize; i++) {
    if (d[i].size() * 2 != size) {
        continue;
    }
    if (encrypt(d[i]) == word2) {
        ans++;
    }
}
```

这里是直接借用了之前的`encrpty()`进行加密，手动加密的版本也放到后面的[完整AC代码中了](#完整ac代码)

#### 复杂度分析

由于本题十分明显的模拟性质以及并不大的数据范围，也就没什么必要进行复杂度分析了

## 完整AC代码

```cpp
// 第一题 转化时间需要的最少操作数
class Solution {
public:
    int convertTime(string current, string correct) {
        int ch = (current[0] - '0') * 10 + (current[1] - '0') * 1;
        int cm = (current[3] - '0') * 10 + (current[4] - '0') * 1;
        int ah = (correct[0] - '0') * 10 + (correct[1] - '0') * 1;
        int am = (correct[3] - '0') * 10 + (correct[4] - '0') * 1;
        int ans = 0;
        int adh = 0, adm = 0;
        if (ch > ah || ch == ah && cm > am) {
            adh = (24 - (ch - ah - 1));
            adm = (60 + am) - cm;
        }
        else {
            adh = ah - ch;
            if (cm > am) {
                adm = (60 + am) - cm;
                adh--;
            }
            else {
                adm = am - cm;
            }
        }
        ans += adh;
        while (adm) {
            if (adm >= 15) {
                adm -= 15;
            }
            else if (adm >= 5) {
                adm -= 5;
            }
            else if (adm >= 1) {
                adm -= 1;
            }
            ans++;
        }
        return ans;
    }
};

// 第二题 找出输掉零场或一场比赛的玩家
class Solution {
public:
    vector<vector<int>> findWinners(vector<vector<int>>& matches) {
        vector<vector<int>> ans(2);
        int size = matches.size();
        map<int, int> w, l;
        for (int i = 0; i < size; i++) {
            if (w.find(matches[i][0]) == w.end()) {
                w.insert(make_pair(matches[i][0], 1));
            }
            else {
                w.find(matches[i][0])->second++;
            }
            if (l.find(matches[i][1]) == l.end()) {
                l.insert(make_pair(matches[i][1], 1));
            }
            else {
                l.find(matches[i][1])->second++;
            }
        }
        for (map<int, int>::iterator it = w.begin(); it != w.end(); it++) {
            if (l.find(it->first) == l.end()) {
                ans[0].push_back(it->first);
            }
        }
        for (map<int, int>::iterator it = l.begin(); it != l.end(); it++) {
            if (it->second == 1) {
                ans[1].push_back(it->first);
            }
        }
        return ans;
    }
};

// 第三题 每个小孩最多能分到多少糖果
class Solution {
public:
    int maximumCandies(vector<int>& candies, long long k) {
        int size = candies.size();
        int l = 0, r = 1e7 + 1;
        while (l + 1 < r) {
            int m = (l + r) / 2;
            long long num = 0;
            for (int i = 0; i < size; i++) {
                num += candies[i] / m;
            }
            if (num < k) {
                r = m;
            }
            else {
                l = m;
            }
        }
        return l;
    }
};

// 第四题 加密解密字符串
class Encrypter {
private:
    vector<char> k;
    vector<string> v;
    vector<string> d;
    int ksize, vsize, dsize;
public:
    Encrypter(vector<char>& keys, vector<string>& values, vector<string>& dictionary) {
        k = keys;
        v = values;
        d = dictionary;
        ksize = keys.size();
        vsize = values.size();
        dsize = dictionary.size();
    }
    
    string encrypt(string word1) {
        string ans;
        int size = word1.size();
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < ksize; j++) {
                if (word1[i] == k[j]) {
                    ans += v[j];
                }
            }
        }
        return ans;
    }

    // 直接使用上面的encrypt()进行加密
    int decrypt(string word2) {
        int ans = 0, size = word2.size();
        for (int i = 0; i < dsize; i++) {
            if (d[i].size() * 2 != size) {
                continue;
            }
            if (encrypt(d[i]) == word2) {
                ans++;
            }
        }
        return ans;
    }
    
    // 手动模拟解密过程
    int decrypt(string word2) {
        int ans = 0, size = word2.size();
        for (int i = 0; i < dsize; i++) {
            if (d[i].size() != size / 2){
                continue;
            }
            bool flag = true;
            for (int j = 0; j < size / 2; j++) {
                string tmp;
                tmp += word2[j * 2];
                tmp += word2[j * 2 + 1];
                flag = false;
                for (int t = 0; t < vsize; t++) {
                    if (tmp == v[t] && k[t] == d[i][j]) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    break;
                }
            }
            if (flag) {
                ans++;
            }
        }
        return ans;
    }
};

/**
 * Your Encrypter object will be instantiated and called as such:
 * Encrypter* obj = new Encrypter(keys, values, dictionary);
 * string param_1 = obj->encrypt(word1);
 * int param_2 = obj->decrypt(word2);
 */
```
