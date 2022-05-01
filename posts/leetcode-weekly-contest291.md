---
title: Leetcode第291场周赛题解
description: "比赛时间：2022/05/01 10:30-12:00，排名：1933/6514"
date: 2022/05/02
---

### 前言

好久不见了啊大家，现在是凌晨的1:28分，让我们来赶紧写一下今天（科学的讲应该是昨天）的周赛题解吧~

## [竞赛链接](https://leetcode.cn/contest/weekly-contest-291/)

## [第一题 移除指定数字得到的最大结果](https://leetcode.cn/problems/remove-digit-from-number-to-maximize-result/)

### 题目描述

给你一个表示某个正整数的字符串 `number` 和一个字符 `digit` 。

从 `number` 中 **恰好** 移除 **一个** 等于 `digit` 的字符后，找出并返回按 **十进制** 表示 **最大** 的结果字符串。生成的测试用例满足 `digit` 在 `number` 中出现至少一次。

样例：
```
输入：number = "123", digit = "3"
输出："12"
解释："123" 中只有一个 '3' ，在移除 '3' 之后，结果为 "12" 。

输入：number = "1231", digit = "1"
输出："231"
解释：可以移除第一个 '1' 得到 "231" 或者移除第二个 '1' 得到 "123" 。
由于 231 > 123 ，返回 "231" 。
```

数据范围：
```
2 <= number.length <= 100
number 由数字 '1' 到 '9' 组成
digit 是 '1' 到 '9' 中的一个数字
digit 在 number 中出现至少一次
```

### 题目分析

第一题就是很常规的暴力模拟啦，我们直接遍历给的字符串，遇到 `digit` 就将这个字符删去，然后将剩余的串作为备选答案，最后在所有备选答案中找到一个最大的就可以下一题了~

由于十进制最大就是字典序最大，所以这里可以通过两个string进行 `max()` 省去存储较小备选答案的空间。

```cpp
if (number[i] == digit) {
    string tmp = number;
    tmp.erase(tmp.begin() + i);
    ans = max(tmp, ans);
}
```

### 复杂度分析

时间复杂度：由于遍历了整个字符串，以字符串的位数为 *n* 的话，时间复杂度为 *O(n)*。

空间复杂度：只需要一个字符串存储最终答案，以字符串的位数为 *n* 的话，空间复杂度为 *O(n)*。

其实处理一个字符串的问题我觉得时间和空间复杂度说是 *O(1)* 也对吧？

## [第二题 必须拿起的最小连续卡牌数](https://leetcode.cn/problems/minimum-consecutive-cards-to-pick-up/)

### 题目描述

给你一个整数数组 `cards` ，其中 `cards[i]` 表示第 `i` 张卡牌的 **值** 。如果两张卡牌的值相同，则认为这一对卡牌 **匹配** 。

返回你必须拿起的最小连续卡牌数，以使在拿起的卡牌中有一对匹配的卡牌。如果无法得到一对匹配的卡牌，返回 `-1` 。

样例：
```
输入：cards = [3,4,2,3,4,7]
输出：4
解释：拿起卡牌 [3,4,2,3] 将会包含一对值为 3 的匹配卡牌。注意，拿起 [4,2,3,4] 也是最优方案。
```

数据范围
```
1 <= cards.length <= 1e5
0 <= cards[i] <= 1e6
```

### 题目分析

从贪心的角度，要使拿起的连续卡牌数最小，那么拿起这一串卡牌的开头和结尾的卡牌应该是匹配的。

所以我们只需要找到所有能够匹配的卡牌所出现的位置，这里可以使用 `map<int, vector<int>>` ，其中第一关键字为卡牌的值，第二关键字为该值出现的位置序列。

```cpp
map<int, vector<int>> mp;
for (int i = 0; i < size; i++) {
    if (mp.find(cards[i]) == mp.end()) {
        vector<int> tmp(1, i);
        mp.insert(make_pair(cards[i], tmp));
    }
    else {
        mp.find(cards[i])->second.push_back(i);
    }
}
```

然后找到其中间距最小的即可:

```cpp
for (auto &it : mp) {
    int vsize = it.second.size();
    for (int i = 0; i < vsize - 1; i++) {
        ans = min(ans, it.second[i + 1] - it.second[i] + 1);
    }
}
```

### 复杂度分析

时间复杂度：对于整个卡牌序列遍历的复杂度是 *O(n)*，每次在map中进行查找或插入的复杂度是 *O(logn)*，则预处理map的复杂度是 *O(nlogn)*。最后遍历整个map，由于刚好每个元素都遍历了一遍，所以复杂度（应该）也是 *O(n)*，尽管这里出现了两个for语句的嵌套。

值得一提的是，想起来之前wls双周赛因为 `auto` 和 `auto&` TLE的故事，我这里也试了这两者之间的区别，实测 `auto&` 能比 `auto` 快200ms左右，性能提升约为25%（仅针对这一题在LeetCode的测试数据而言），所以能用 `auto&` 还是别用 `auto` 了

空间复杂度：这里用map的空间复杂度应为 *O(nlogn)*



## [第三题 含最多 K 个可整除元素的子数组](https://leetcode.cn/problems/k-divisible-elements-subarrays/)

### 题目描述

给你一个整数数组 `nums` 和两个整数 `k` 和 `p` ，找出并返回满足要求的不同的子数组数，要求子数组中最多 `k` 个可被 `p` 整除的元素。

如果满足下述条件之一，则认为数组 `nums1` 和 `nums2` 是 **不同** 数组：

两数组长度 **不同** ，或者
存在 至少 一个下标 `i` 满足`nums1[i] != nums2[i]` 。
**子数组** 定义为：数组中的 **连续** 元素组成的一个 **非空** 序列。

样例：
```
输入：nums = [2,3,3,2,2], k = 2, p = 2
输出：11
解释：
位于下标 0、3 和 4 的元素都可以被 p = 2 整除。
共计 11 个不同子数组都满足最多含 k = 2 个可以被 2 整除的元素：
[2]、[2,3]、[2,3,3]、[2,3,3,2]、[3]、[3,3]、[3,3,2]、[3,3,2,2]、[3,2]、[3,2,2] 和 [2,2] 。
注意，尽管子数组 [2] 和 [3] 在 nums 中出现不止一次，但统计时只计数一次。
子数组 [2,3,3,2,2] 不满足条件，因为其中有 3 个元素可以被 2 整除。
```

数据范围：
```
1 <= nums.length <= 200
1 <= nums[i], p <= 200
1 <= k <= nums.length
```

### 题目分析



### 复杂度分析



## [第四题 字符串的总引力](https://leetcode.cn/problems/total-appeal-of-a-string/)

### 题目描述
字符串的 **引力** 定义为：字符串中 **不同** 字符的数量。

例如，"abbca" 的引力为 `3` ，因为其中有 `3` 个不同字符 'a'、'b' 和 'c' 。
给你一个字符串 `s` ，返回 **其所有子字符串的总引力** 。

**子字符串** 定义为：字符串中的一个 **连续** 字符序列。

样例：
```
输入：s = "abbca"
输出：28
解释："abbca" 的子字符串有：
- 长度为 1 的子字符串："a"、"b"、"b"、"c"、"a" 的引力分别为 1、1、1、1、1，总和为 5 。
- 长度为 2 的子字符串："ab"、"bb"、"bc"、"ca" 的引力分别为 2、1、2、2 ，总和为 7 。
- 长度为 3 的子字符串："abb"、"bbc"、"bca" 的引力分别为 2、2、3 ，总和为 7 。
- 长度为 4 的子字符串："abbc"、"bbca" 的引力分别为 3、3 ，总和为 6 。
- 长度为 5 的子字符串："abbca" 的引力为 3 ，总和为 3 。
引力总和为 5 + 7 + 7 + 6 + 3 = 28 。
```

数据范围：
```
1 <= s.length <= 1e5
s 由小写英文字母组成
```

### 题目分析



### 复杂度分析



## 完整AC代码

```cpp
// 第一题 移除指定数字得到的最大结果
class Solution {
public:
    string removeDigit(string number, char digit) {
        string ans;
        int size = number.size();
        for (int i = 0; i < size; i++) {
            if (number[i] == digit) {
                string tmp = number;
                tmp.erase(tmp.begin() + i);
                ans = max(tmp, ans);
            }
        }
        return ans;
    }
};

// 第二题 必须拿起的最小连续卡牌数
class Solution {
public:
    int minimumCardPickup(vector<int>& cards) {
        int size = cards.size();
        map<int, vector<int>> mp;
        for (int i = 0; i < size; i++) {
            if (mp.find(cards[i]) == mp.end()) {
                vector<int> tmp(1, i);
                mp.insert(make_pair(cards[i], tmp));
            }
            else {
                mp.find(cards[i])->second.push_back(i);
            }
        }
        int ans = 1e5 + 1;
        for (auto &it : mp) {
            int vsize = it.second.size();
            for (int i = 0; i < vsize - 1; i++) {
                ans = min(ans, it.second[i + 1] - it.second[i] + 1);
            }
        }
        if (ans > 1e5) {
            ans = -1;
        }
        return ans;
    }
};

// 第三题 含最多 K 个可整除元素的子数组
class Solution {
public:
    int countDistinct(vector<int>& nums, int k, int p) {
        int size = nums.size(), mnum = 0;
        vector<int> res(size, 0), pre(size);
        for (int i = 0; i < size; i++) {
            if (nums[i] % p == 0) {
                res[i]++;
            }
        }
        partial_sum(res.begin(), res.end(), pre.begin());
        pre.insert(pre.begin(), 0);
        int ans = 0;
        for (int len = 1; len <= size; len++) {
            set<vector<int>> s;
            int l = 0, r = size - len;
            for (int i = l; i <= r; i++) {
                if (pre[i + len] - pre[i] <= k) {
                    vector<int> tmp;
                    for (int t = i; t < i + len; t++) {
                        tmp.push_back(nums[t]);
                    }
                    s.insert(tmp);
                }
            }
            ans += s.size();
        }
        return ans;
    }
};
```
