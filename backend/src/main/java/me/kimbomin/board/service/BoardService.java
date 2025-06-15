package me.kimbomin.board.service;

import me.kimbomin.board.dto.BoardResDto;
import me.kimbomin.board.service.strategy.LoadStrategy;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class BoardService {
    private final Map<String, LoadStrategy> strategyMap;

    // 생성자 주입을 통해 모든 LoadStrategy 구현체를 받아서 Map에 저장
    public BoardService(List<LoadStrategy> strategies) {
        this.strategyMap = strategies.stream()
                .collect(Collectors.toMap(LoadStrategy::getStrategyNm, Function.identity()));
    }

    public List<BoardResDto> getPosts(String strategyName, Pageable pageable, Long cursorId) {
        // strategyName으로 적절한 전략을 찾음
        LoadStrategy strategy = strategyMap.get(strategyName);

        if (strategy == null) {
            throw new IllegalArgumentException("지원하지 않는 전략입니다: " + strategyName);
        }

        // 선택된 전략의 load 메소드 실행
        return strategy.load(pageable, cursorId);
    }
}
